import React, { Component } from 'react';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { Link } from 'react-router-dom';
import { Pane, Text, ActionBar, Button } from '@cybercongress/gravity';
import LocalizedStrings from 'react-localization';
import { CosmosDelegateTool } from '../../utils/ledger';
import {
  JsonTransaction,
  TransactionSubmitted,
  Confirmed,
  SendLedger,
  ConnectLadger,
  TransactionError,
  Dots,
} from '../../components';
import { LEDGER, CYBER, PATTERN_CYBER } from '../../utils/config';
import { getBalanceWallet, statusNode } from '../../utils/search/utils';
import { downloadObjectAsJson, getDelegator } from '../../utils/utils';

import { i18n } from '../../i18n/en';

const { CYBER_NODE_URL, DIVISOR_CYBER_G } = CYBER;

const T = new LocalizedStrings(i18n);

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

class ActionBarContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
      ledger: null,
      ledgerVersion: [0, 0, 0],
      returnCode: null,
      addressInfo: null,
      address: null,
      balance: 0,
      time: 0,
      toSend: '',
      toSendAddres: '',
      txBody: null,
      txContext: null,
      txMsg: null,
      txHash: null,
      txHeight: null,
      errorMessage: null,
      valueInputAddres: '',
    };
    this.gasField = React.createRef();
    this.gasPriceField = React.createRef();
    this.timeOut = null;
    this.haveDocument = typeof document !== 'undefined';
  }

  componentDidMount() {
    this.pollLedger();
  }

  componentDidUpdate() {
    const { addAddress } = this.props;
    const { stage, ledger, returnCode, address, addressInfo } = this.state;

    if (addAddress === false && stage === STAGE_ADD_ADDRESS_OK) {
      this.cleatState();
    }

    if (stage === STAGE_LEDGER_INIT) {
      if (ledger === null) {
        this.pollLedger();
      }
      if (ledger !== null) {
        switch (returnCode) {
          case LEDGER_OK:
            if (address === null) {
              this.getAddress();
            }
            if (address !== null && addressInfo === null) {
              this.getAddressInfo();
            }
            break;
          default:
            // console.log('getVersion');
            this.getVersion();
            break;
        }
      } else {
        // eslint-disable-next-line
        console.warn('Still looking for a Ledger device.');
      }
    }
    if (stage === STAGE_ADD_ADDRESS_LEDGER) {
      if (ledger === null) {
        this.pollLedger();
      }
      if (ledger !== null) {
        switch (returnCode) {
          case LEDGER_OK:
            if (address === null) {
              this.addAddressLedger();
            }
            break;
          default:
            // console.log('getVersion');
            this.getVersion();
            break;
        }
      } else {
        // eslint-disable-next-line
        console.warn('Still looking for a Ledger device.');
      }
    }
  }

  compareVersion = async () => {
    const test = this.state.ledgerVersion;
    const target = LEDGER_VERSION_REQ;
    const testInt = 10000 * test[0] + 100 * test[1] + test[2];
    const targetInt = 10000 * target[0] + 100 * target[1] + target[2];
    return testInt >= targetInt;
  };

  pollLedger = async () => {
    const transport = await TransportU2F.create();
    this.setState({ ledger: new CosmosDelegateTool(transport) });
  };

  getVersion = async () => {
    const { ledger, returnCode } = this.state;
    try {
      const connect = await ledger.connect();
      console.log('connect', connect);
      if (returnCode === null || connect.return_code !== returnCode) {
        this.setState({
          txMsg: null,
          address: null,
          addressInfo: null,
          requestMetaData: null,
          txBody: null,
          errorMessage: null,
          returnCode: connect.return_code,
          version_info: [connect.major, connect.minor, connect.patch],
        });
        // eslint-disable-next-line
        console.warn('Ledger app return_code', returnCode);
      } else {
        this.setState({ time: Date.now() }); // cause componentWillUpdate to call again.
      }
    } catch ({ message, statusCode }) {
      // eslint-disable-next-line
      // eslint-disable-next-line
      this.setState({
        ledger: null,
      });
      console.error('Problem with Ledger communication', message, statusCode);
    }
  };

  addAddressLedger = async () => {
    try {
      const { ledger } = this.state;
      const { updateAddress } = this.props;
      const accounts = {};

      const addressLedgerCyber = await ledger.retrieveAddressCyber(HDPATH);
      const addressLedgerCosmos = await ledger.retrieveAddress(HDPATH);

      accounts.cyber = addressLedgerCyber;
      accounts.cosmos = addressLedgerCosmos;
      accounts.keys = 'ledger';

      console.log('address', addressLedgerCyber);

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
      this.setState({ time: Date.now(), stage: STAGE_ERROR }); // cause componentWillUpdate to call again.
    }
  };

  getAddress = async () => {
    const { ledger } = this.state;
    try {
      const address = await ledger.retrieveAddressCyber(HDPATH);
      console.log('address', address);
      this.setState({
        address,
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
    const { ledger, address, addressInfo, toSend, toSendAddres } = this.state;

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
    const tx = await ledger.txCreateSendCyber(
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
    const { ledger, address, addressInfo } = this.state;
    const txContext = {
      accountNumber: addressInfo.account_number,
      chainId: addressInfo.chainId,
      sequence: addressInfo.sequence,
      bech32: address.bech32,
      pk: address.pk,
      path: address.path,
    };
    // console.log('txContext', txContext);
    const tx = await ledger.importLink(
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
    const { txMsg, ledger, txContext } = this.state;
    // console.log('txContext', txContext);
    this.setState({ stage: STAGE_WAIT });
    const sing = await ledger.sign(txMsg, txContext);
    console.log('sing', sing);
    if (sing.return_code === LEDGER.LEDGER_OK) {
      const applySignature = await ledger.applySignature(
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
    const { ledger, txBody } = this.state;
    const txSubmit = await ledger.txSubmitCyber(txBody);
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
    if (this.state.txHash !== null) {
      this.setState({ stage: STAGE_CONFIRMING });
      const status = await this.state.ledger.txStatusCyber(this.state.txHash);
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

  onChangeInputAmount = e => {
    this.setState({
      toSend: e.target.value,
    });
  };

  onChangeInputInputAddressT = e => {
    this.setState({
      toSendAddres: e.target.value,
    });
  };

  onClickInitLedger = () => {
    this.setState({
      stage: STAGE_LEDGER_INIT,
    });
  };

  importCli = async () => {
    const { ledger } = this.state;
    const { links, addressTable } = this.props;

    if (links !== null) {
      const allItem = [].concat.apply([], links);

      console.log(allItem);
      const tx = await ledger.importLink(
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
      ledger: null,
      ledgerVersion: [0, 0, 0],
      returnCode: null,
      addressInfo: null,
      address: null,
      balance: 0,
      time: 0,
      toSend: '',
      toSendAddres: '',
      txBody: null,
      txContext: null,
      txMsg: null,
      txHash: null,
      txHeight: null,
      errorMessage: null,
      valueInputAddres: '',
    });
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
    if (updateAddress) {
      updateAddress();
    }
  };

  onClickAddAddressLedger = () => {
    this.setState({
      stage: STAGE_ADD_ADDRESS_LEDGER,
    });
  };

  onClickAddAddressUser = () => {
    this.setState({
      stage: STAGE_ADD_ADDRESS_USER,
    });
  };

  onChangeInputAddress = e => {
    this.setState({
      valueInputAddres: e.target.value,
    });
  };

  onClickAddAddressUserToLocalStr = () => {
    const { valueInputAddres } = this.state;
    console.log(valueInputAddres);
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

    if (valueInputAddres.match(PATTERN_CYBER)) {
      const cosmosAddress = getDelegator(valueInputAddres, 'cosmos');
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
    const {
      addAddress,
      addressSend,
      send,
      addressInfo,
      importLink,
      linkSelected,
      selectCard,
    } = this.props;
    const {
      stage,
      connect,
      address,
      returnCode,
      ledgerVersion,
      toSend,
      balance,
      toSendAddres,
      txMsg,
      txHash,
      errorMessage,
      txHeight,
      valueInputAddres,
    } = this.state;

    if (addAddress && stage === STAGE_INIT) {
      return (
        <ActionBar>
          <Pane>
            <Button marginX="10px" onClick={this.onClickAddAddressUser}>
              put only address
            </Button>
            <Button
              paddingX="15px"
              marginX="10px"
              onClick={this.onClickAddAddressLedger}
            >
              {T.actionBar.pocket.put}
            </Button>
          </Pane>
        </ActionBar>
      );
    }

    if (addAddress && stage === STAGE_ADD_ADDRESS_USER) {
      return (
        <ActionBar>
          <Pane
            flex={1}
            justifyContent="center"
            alignItems="center"
            fontSize="18px"
            display="flex"
          >
            put cyber address:
            <input
              value={valueInputAddres}
              style={{
                height: '42px',
                maxWidth: '200px',
                marginLeft: '10px',
                textAlign: 'end',
              }}
              onChange={this.onChangeInputAddress}
              placeholder="address"
              autoFocus
            />
          </Pane>

          <Button
            disabled={!valueInputAddres.match(PATTERN_CYBER)}
            onClick={this.onClickAddAddressUserToLocalStr}
          >
            add address
          </Button>
        </ActionBar>
      );
    }

    if (addAddress && stage === STAGE_ADD_ADDRESS_OK) {
      return (
        <ActionBar>
          <Pane display="flex" alignItems="center">
            <Pane fontSize={20}>adding address</Pane>
            <Dots big />
          </Pane>
        </ActionBar>
      );
    }

    if (
      selectCard === 'pubkey' &&
      (stage === STAGE_INIT || stage === STAGE_ADD_ADDRESS_OK)
    ) {
      return (
        <ActionBar>
          <Pane>
            <Button marginX={10} onClick={this.deletPubkey}>
              delete account
            </Button>
            <Button marginX={10} onClick={e => this.onClickInitLedger(e)}>
              {T.actionBar.pocket.send}
            </Button>
          </Pane>
        </ActionBar>
      );
    }

    if (
      selectCard === 'gol' &&
      (stage === STAGE_INIT || stage === STAGE_ADD_ADDRESS_OK)
    ) {
      return (
        <ActionBar>
          <Pane>
            <Link
              style={{ paddingTop: 10, paddingBottom: 10, display: 'block' }}
              className="btn"
              to="/gol"
            >
              go and play
            </Link>
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
            <Button onClick={this.onClickInitLedger}>sing ledger</Button>
          </Pane>
        </ActionBar>
      );
    }

    if (
      selectCard === '' &&
      (stage === STAGE_INIT || stage === STAGE_ADD_ADDRESS_OK)
    ) {
      return (
        <ActionBar>
          <Pane>
            <Button onClick={e => this.onClickInitLedger(e)}>
              {T.actionBar.pocket.send}
            </Button>
          </Pane>
        </ActionBar>
      );
    }

    if (stage === STAGE_LEDGER_INIT || stage === STAGE_ADD_ADDRESS_LEDGER) {
      return (
        <ConnectLadger
          pin={returnCode >= LEDGER_NOAPP}
          app={returnCode === LEDGER_OK}
          onClickBtnCloce={this.cleatState}
          version={
            returnCode === LEDGER_OK &&
            this.compareVersion(ledgerVersion, LEDGER_VERSION_REQ)
          }
        />
      );
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
      stage === STAGE_READY &&
      this.hasKey() &&
      this.hasWallet()
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
          onChangeInputAmount={e => this.onChangeInputAmount(e)}
          valueInputAmount={toSend}
          onClickBtnCloce={this.cleatState}
          valueInputAddressTo={toSendAddres}
          onChangeInputAddressTo={e => this.onChangeInputInputAddressT(e)}
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
          onClickBtn={this.cleatState}
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
