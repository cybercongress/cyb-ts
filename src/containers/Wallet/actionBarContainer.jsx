import { Component } from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { Pane, ActionBar, Button } from '@cybercongress/gravity';
import { CosmosDelegateTool } from '../../utils/ledger';
import {
  JsonTransaction,
  TransactionSubmitted,
  Confirmed,
  SendLedger,
  ConnectLadger,
  TransactionError,
  CheckAddressInfo,
} from '../../components';
import {
  LEDGER,
  CYBER,
  PATTERN_COSMOS,
  PATTERN_CYBER,
} from '../../utils/config';
import { getBalanceWallet, statusNode } from '../../utils/search/utils';
import { downloadObjectAsJson, fromBech32 } from '../../utils/utils';

const imgLedger = require('../../image/ledger.svg');

const { DIVISOR_CYBER_G } = CYBER;

const {
  STAGE_INIT,
  STAGE_LEDGER_INIT,
  HDPATH,
  LEDGER_VERSION_REQ,
  LEDGER_OK,
  LEDGER_NOAPP,
  STAGE_READY,
  STAGE_WAIT,
  STAGE_SUBMITTED,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
  STAGE_ERROR,
  MEMO,
} = LEDGER;

const STAGE_ADD_ADDRESS_LEDGER = 1.1;
const STAGE_ADD_ADDRESS_USER = 2.1;
const STAGE_ADD_ADDRESS_OK = 2.2;
const LEDGER_TX_ACOUNT_INFO = 2.5;

class ActionBarContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
      ledgerVersion: [0, 0, 0],
      returnCode: null,
      addressInfo: null,
      address: null,
      balance: 0,
      toSend: '',
      toSendAddres: '',
      txBody: null,
      txContext: null,
      txMsg: null,
      txHash: null,
      txHeight: null,
      errorMessage: null,
      connectLedger: null,
      valueInputAddres: '',
    };
    this.timeOut = null;
    this.ledger = null;
    this.transport = null;
  }

  // async componentDidMount() {
  //   this.pollLedger();
  // }

  componentDidUpdate() {
    const { addAddress } = this.props;
    const { stage, ledger, returnCode, address, addressInfo } = this.state;

    if (addAddress === false && stage === STAGE_ADD_ADDRESS_OK) {
      this.cleatState();
    }
  }

  getLedgerAddress = async () => {
    const { stage } = this.state;
    this.transport = await TransportWebUSB.create(120 * 1000);
    this.ledger = new CosmosDelegateTool(this.transport);

    const connect = await this.ledger.connect();
    if (connect.return_code === LEDGER_OK) {
      if (stage === STAGE_LEDGER_INIT) {
        this.setState({
          connectLedger: true,
        });

        const address = await this.ledger.retrieveAddressCyber(HDPATH);
        this.setState({
          address,
        });
        this.getAddressInfo();
      }
      if (stage === STAGE_ADD_ADDRESS_LEDGER) {
        this.addAddressLedger();
      }
      this.setState({
        connectLedger: true,
      });
    } else {
      this.setState({
        connectLedger: false,
      });
    }
  };

  addAddressLedger = async () => {
    try {
      const { updateAddress } = this.props;
      const accounts = {};

      const addressLedgerCyber = await this.ledger.retrieveAddressCyber(HDPATH);
      const addressLedgerCosmos = await this.ledger.retrieveAddress(HDPATH);

      accounts.cyber = addressLedgerCyber;
      accounts.cosmos = addressLedgerCosmos;
      accounts.keys = 'ledger';

      localStorage.setItem('ledger', JSON.stringify(addressLedgerCyber));
      localStorage.setItem('pocket', JSON.stringify(accounts));

      if (updateAddress) {
        updateAddress();
      }
      this.setState({
        stage: STAGE_ADD_ADDRESS_OK,
      });
    } catch (error) {
      const { message, statusCode } = error;
      if (message !== "Cannot read property 'length' of undefined") {
        // this just means we haven't found the device yet...
        // eslint-disable-next-line
        console.error('Problem reading address data', message, statusCode);
      }
      this.setState({ time: Date.now() }); // cause componentWillUpdate to call again.
    }
  };

  getNetworkId = async () => {
    const data = await statusNode();
    if (data !== null) {
      return data.node_info.network;
    }
    return null;
  };

  getAddressInfo = async () => {
    const { address } = this.state;
    const { addressSend } = this.props;
    this.setState({
      stage: LEDGER_TX_ACOUNT_INFO,
    });
    let toSendAddres = '';
    let addressInfo = {};
    let balance = 0;
    try {
      const responseBalanceWallet = await getBalanceWallet(address.bech32);
      const chainId = await this.getNetworkId();

      if (responseBalanceWallet) {
        addressInfo = responseBalanceWallet.account;
        balance = addressInfo.coins[0].amount;
      }

      if (chainId !== null) {
        addressInfo.chainId = chainId;
      }

      if (addressSend) {
        toSendAddres = addressSend;
      }

      this.setState({
        addressInfo,
        toSendAddres,
        balance,
        stage: STAGE_READY,
      });
    } catch (error) {
      const { message, statusCode } = error;
      if (message !== "Cannot read property 'length' of undefined") {
        //     // this just means we haven't found the device yet...
        //     // eslint-disable-next-line
        console.error('Problem reading address data', message, statusCode);
      }
      this.setState({ time: Date.now() }); // cause componentWillUpdate to call again.
    }
  };

  generateTx = async () => {
    const { address, addressInfo, toSend, toSendAddres } = this.state;

    const uatomAmount = toSend * DIVISOR_CYBER_G;

    const { denom } = addressInfo.coins[0];

    const txContext = {
      accountNumber: addressInfo.account_number,
      chainId: addressInfo.chainId,
      sequence: addressInfo.sequence,
      bech32: address.bech32,
      pk: address.pk,
      path: address.path,
    };
    // console.log('txContext', txContext);
    const tx = await this.ledger.txCreateSendCyber(
      txContext,
      toSendAddres,
      uatomAmount,
      MEMO,
      denom
    );
    console.log('tx', tx);
    await this.setState({
      txMsg: tx,
      txContext,
      txBody: null,
      error: null,
    });
    // debugger;
    this.signTx();
  };

  generateTxImport = async () => {
    const { linkSelected, addressTable } = this.props;
    const { address, addressInfo } = this.state;
    const txContext = {
      accountNumber: addressInfo.account_number,
      chainId: addressInfo.chainId,
      sequence: addressInfo.sequence,
      bech32: address.bech32,
      pk: address.pk,
      path: address.path,
    };
    // console.log('txContext', txContext);
    const tx = await this.ledger.importLink(
      txContext,
      addressTable,
      linkSelected,
      MEMO
    );
    console.log('tx', tx);
    await this.setState({
      txMsg: tx,
      txContext,
      txBody: null,
      error: null,
    });
    // debugger;
    this.signTx();
  };

  signTx = async () => {
    const { txMsg, txContext } = this.state;
    // console.log('txContext', txContext);
    this.setState({ stage: STAGE_WAIT });
    const sing = await this.ledger.sign(txMsg, txContext);
    console.log('sing', sing);
    if (sing.return_code === LEDGER.LEDGER_OK) {
      const applySignature = await this.ledger.applySignature(
        sing,
        txMsg,
        txContext
      );
      if (applySignature !== null) {
        this.setState({
          txMsg: null,
          txBody: applySignature,
          stage: STAGE_SUBMITTED,
        });
        await this.injectTx();
      }
    } else {
      this.setState({
        stage: STAGE_ERROR,
        txBody: null,
        errorMessage: sing.error_message,
      });
    }
  };

  injectTx = async () => {
    const { txBody } = this.state;
    const txSubmit = await this.ledger.txSubmitCyber(txBody);
    const data = txSubmit;
    console.log('data', data);
    if (data.error) {
      // if timeout...
      // this.setState({stage: STAGE_CONFIRMING})
      // else
      this.setState({ stage: STAGE_ERROR, errorMessage: data.error });
    } else {
      this.setState({ stage: STAGE_SUBMITTED, txHash: data.data.txhash });
      this.timeOut = setTimeout(this.confirmTx, 1500);
    }
  };

  confirmTx = async () => {
    const { updateAddress, selectedIndex } = this.props;
    const { txHash } = this.state;

    if (txHash && txHash !== null) {
      this.setState({ stage: STAGE_CONFIRMING });
      const status = await this.ledger.txStatusCyber(txHash);
      console.log('status', status);
      const data = await status;
      if (data.logs) {
        this.setState({
          stage: STAGE_CONFIRMED,
          txHeight: data.height,
        });

        const localStorageStoryLink = localStorage.getItem('linksImport');
        if (localStorageStoryLink !== null) {
          const linksLocal = JSON.parse(localStorageStoryLink);
          linksLocal.splice(selectedIndex, 1);
          localStorage.setItem('linksImport', JSON.stringify(linksLocal));
        }

        if (updateAddress) {
          updateAddress();
        }
        return;
      }
      if (data.code) {
        this.setState({
          stage: STAGE_ERROR,
          txHeight: data.height,
          errorMessage: data.raw_log,
        });
        return;
      }
      if (data.code) {
        this.setState({
          stage: STAGE_ERROR,
          txHeight: data.height,
          errorMessage: data.raw_log,
        });
        return;
      }
    }

    this.timeOut = setTimeout(this.confirmTx, 1500);
  };

  onChangeInputAmount = (e) => {
    this.setState({
      toSend: e.target.value,
    });
  };

  onChangeInputInputAddressT = (e) => {
    this.setState({
      toSendAddres: e.target.value,
    });
  };

  onClickInitLedger = async () => {
    await this.setState({
      stage: STAGE_LEDGER_INIT,
    });
    this.getLedgerAddress();
  };

  importCli = async () => {
    const { links, addressTable } = this.props;

    if (links !== null) {
      const allItem = [].concat.apply([], links);

      console.log(allItem);
      const tx = await this.ledger.importLink(
        null,
        addressTable,
        allItem,
        MEMO,
        true
      );
      downloadObjectAsJson(tx, 'tx_links');
    }
  };

  cleatState = () => {
    this.setState({
      stage: STAGE_INIT,
      ledgerVersion: [0, 0, 0],
      returnCode: null,
      addressInfo: null,
      address: null,
      balance: 0,
      toSend: '',
      toSendAddres: '',
      txBody: null,
      txContext: null,
      txMsg: null,
      txHash: null,
      txHeight: null,
      errorMessage: null,
      connectLedger: null,
      valueInputAddres: '',
    });
    this.timeOut = null;
    this.ledger = null;
    this.transport = null;
  };

  hasKey() {
    return this.state.address !== null;
  }

  hasWallet() {
    return this.state.addressInfo !== null;
  }

  deletPubkey = () => {
    const { updateAddress } = this.props;

    localStorage.removeItem('pocket');
    localStorage.removeItem('ledger');
    localStorage.removeItem('linksImport');
    if (updateAddress) {
      updateAddress();
    }
  };

  onClickAddAddressLedger = async () => {
    await this.setState({
      stage: STAGE_ADD_ADDRESS_LEDGER,
    });
    this.getLedgerAddress();
  };

  onClickAddAddressUser = () => {
    this.setState({
      stage: STAGE_ADD_ADDRESS_USER,
    });
  };

  onChangeInputAddress = (e) => {
    this.setState({
      valueInputAddres: e.target.value,
    });
  };

  onClickAddAddressUserToLocalStr = () => {
    const { valueInputAddres } = this.state;
    const { updateAddress } = this.props;
    const accounts = {
      cyber: {
        bech32: '',
      },
      cosmos: {
        bech32: '',
      },
    };
    const addressLedgerCyber = {
      bech32: '',
    };

    if (valueInputAddres.match(PATTERN_COSMOS)) {
      const cyberAddress = fromBech32(
        valueInputAddres,
        CYBER.BECH32_PREFIX_ACC_ADDR_CYBER
      );
      accounts.cyber.bech32 = cyberAddress;
      addressLedgerCyber.bech32 = cyberAddress;
      accounts.cosmos.bech32 = valueInputAddres;
      accounts.keys = 'user';

      localStorage.setItem('ledger', JSON.stringify(addressLedgerCyber));
      localStorage.setItem('pocket', JSON.stringify(accounts));

      this.setState({
        stage: STAGE_ADD_ADDRESS_OK,
      });
    }

    if (valueInputAddres.match(PATTERN_CYBER)) {
      const cosmosAddress = fromBech32(valueInputAddres, 'cosmos');
      accounts.cyber.bech32 = valueInputAddres;
      addressLedgerCyber.bech32 = valueInputAddres;
      accounts.cosmos.bech32 = cosmosAddress;
      accounts.keys = 'user';

      localStorage.setItem('ledger', JSON.stringify(addressLedgerCyber));
      localStorage.setItem('pocket', JSON.stringify(accounts));

      this.setState({
        stage: STAGE_ADD_ADDRESS_OK,
      });
    }

    if (updateAddress) {
      updateAddress();
    }
  };

  render() {
    const { addAddress, linkSelected, selectCard, updateAddress } = this.props;
    const {
      stage,
      connectLedger,
      address,
      toSend,
      balance,
      toSendAddres,
      txMsg,
      txHash,
      errorMessage,
      txHeight,
      valueInputAddres,
    } = this.state;

    if (
      selectCard.indexOf('pubkey') !== -1 &&
      (stage === STAGE_INIT || stage === STAGE_ADD_ADDRESS_OK)
    ) {
      return (
        <ActionBar>
          <Pane>
            <Button
              marginX={10}
              onClick={() => this.deletPubkey(updateAddress)}
            >
              Drop key
            </Button>
            <Button marginX={10} onClick={() => this.onClickInitLedger()}>
              Send EUL{' '}
              <img
                style={{
                  width: 20,
                  height: 20,
                  marginLeft: '5px',
                  paddingTop: '2px',
                }}
                src={imgLedger}
                alt="ledger"
              />
            </Button>
          </Pane>
        </ActionBar>
      );
    }

    if (
      selectCard === 'importCli' &&
      (stage === STAGE_INIT || stage === STAGE_ADD_ADDRESS_OK)
    ) {
      return (
        <ActionBar>
          <Pane>
            <Button onClick={this.importCli}>use CLI</Button>
          </Pane>
        </ActionBar>
      );
    }

    if (
      selectCard === 'importLedger' &&
      (stage === STAGE_INIT || stage === STAGE_ADD_ADDRESS_OK)
    ) {
      return (
        <ActionBar>
          <Pane>
            <Button onClick={this.onClickInitLedger}>sing with ledger</Button>
          </Pane>
        </ActionBar>
      );
    }

    if (stage === STAGE_LEDGER_INIT || stage === STAGE_ADD_ADDRESS_LEDGER) {
      return (
        <ConnectLadger
          onClickConnect={() => this.getLedgerAddress()}
          connectLedger={connectLedger}
        />
      );
    }

    if (stage === LEDGER_TX_ACOUNT_INFO) {
      return <CheckAddressInfo />;
    }

    if (selectCard === 'importLedger' && stage === STAGE_READY) {
      return (
        <ActionBar>
          <Pane flex={1} textAlign="center" fontSize="18px">
            sign {linkSelected.length} CyberLink
          </Pane>
          <Button onClick={this.generateTxImport}>sing</Button>
        </ActionBar>
      );
    }

    if (
      (selectCard === '' || selectCard === 'pubkey') &&
      stage === STAGE_READY
    ) {
      // if (this.state.stage === STAGE_READY) {
      return (
        <SendLedger
          onClickBtn={() => this.generateTx()}
          address={address.bech32}
          availableStake={
            balance !== 0
              ? Math.floor((balance / DIVISOR_CYBER_G) * 1000) / 1000
              : 0
          }
          onChangeInputAmount={(e) => this.onChangeInputAmount(e)}
          valueInputAmount={toSend}
          onClickBtnCloce={this.cleatState}
          valueInputAddressTo={toSendAddres}
          onChangeInputAddressTo={(e) => this.onChangeInputInputAddressT(e)}
          disabledBtn={
            toSend.length === 0 || toSendAddres.length === 0 || balance === 0
          }
        />
      );
    }

    if (stage === STAGE_WAIT) {
      return (
        <JsonTransaction txMsg={txMsg} onClickBtnCloce={this.cleatState} />
      );
    }

    if (stage === STAGE_SUBMITTED || stage === STAGE_CONFIRMING) {
      return <TransactionSubmitted onClickBtnCloce={this.cleatState} />;
    }

    if (stage === STAGE_CONFIRMED) {
      return (
        <Confirmed
          txHash={txHash}
          txHeight={txHeight}
          onClickBtnCloce={this.cleatState}
        />
      );
    }

    if (stage === STAGE_ERROR && errorMessage !== null) {
      return (
        <TransactionError
          errorMessage={errorMessage}
          onClickBtn={this.cleatState}
          onClickBtnCloce={this.cleatState}
        />
      );
    }

    return null;
  }
}

export default ActionBarContainer;
