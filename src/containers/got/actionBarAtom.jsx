import React, { Component } from 'react';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { CosmosDelegateTool } from '../../utils/ledger';
import { COSMOS, LEDGER } from '../../utils/config';
import {
  JsonTransaction,
  Confirmed,
  TransactionSubmitted,
  ConnectLadger,
  SendLedgerAtomTot,
  SendAmount,
} from '../../components';

const {
  STAGE_INIT,
  STAGE_SELECTION,
  STAGE_LEDGER_INIT,
  STAGE_READY,
  STAGE_WAIT,
  STAGE_SUBMITTED,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
  STAGE_ERROR,
  LEDGER_VERSION_REQ,
  HDPATH,
  LEDGER_OK,
  LEDGER_NOAPP,
  MEMO,
} = LEDGER;

const { ADDR_FUNDING, DEFAULT_GAS, DEFAULT_GAS_PRICE, DIVISOR_ATOM } = COSMOS;

class ActionBarAtom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_SELECTION,
      ledger: null,
      ledgerVersion: [0, 0, 0],
      returnCode: null,
      addressInfo: null,
      address: null,
      availableStake: 0,
      time: 0,
      gas: DEFAULT_GAS,
      gasPrice: DEFAULT_GAS_PRICE,
      toSend: '',
      txBody: null,
      txContext: null,
      txHash: null,
      txHeight: null,
      height50: false,
    };
    this.ledgerModal = React.createRef();
    this.atomField = React.createRef();
    this.gasField = React.createRef();
    this.gasPriceField = React.createRef();
    this.timeOut = null;
    this.haveDocument = typeof document !== 'undefined';
  }

  componentDidMount() {
    // eslint-disable-next-line
    console.warn('Looking for Ledger Nano');
    this.pollLedger();
  }

  componentWillUpdate() {
    const { ledger, returnCode, address, addressInfo, stage } = this.state;
    if (ledger === null) {
      this.pollLedger();
    }
    if (stage === STAGE_LEDGER_INIT) {
      if (ledger !== null) {
        switch (returnCode) {
          case LEDGER_OK:
            if (address === null) {
              this.getAddress();
            }
            if (address !== null && addressInfo === null) {
              this.getWallet();
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
    const { ledgerVersion } = this.state;
    const test = ledgerVersion;
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
      if (returnCode === null || connect.return_code !== returnCode) {
        const { major, minor, patch } = connect;
        const ledgerVersion = [major, minor, patch];

        this.setState({
          txMsg: null,
          address: null,
          txBody: null,
          returnCode: connect.return_code,
          ledgerVersion,
        });
        // eslint-disable-next-line
        console.warn('Ledger app return_code', this.state.returnCode);
      } else {
        this.setState({ time: Date.now() }); // cause componentWillUpdate to call again.
      }
    } catch ({ message, statusCode }) {
      // eslint-disable-next-line
      // eslint-disable-next-line
      console.error('Problem with Ledger communication', message, statusCode);
    }
  };

  getAddress = async () => {
    const { ledger } = this.state;
    try {
      const address = await ledger.retrieveAddress(HDPATH);
      console.log('address', address);
      this.setState({
        address,
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

  getWallet = async () => {
    const { ledger, address } = this.state;

    const addressInfo = await ledger.getAccountInfo(address);

    this.setState({
      addressInfo,
      availableStake: parseFloat(addressInfo.balanceuAtom),
      stage: STAGE_READY,
    });
  };

  generateTx = async () => {
    const { ledger, address, addressInfo } = this.state;
    const { valueAmount } = this.props;
    const validatorBech32 = ADDR_FUNDING;
    const uatomAmount = valueAmount * DIVISOR_ATOM;
    const txContext = {
      accountNumber: addressInfo.accountNumber,
      balanceuAtom: addressInfo.balanceuAtom,
      chainId: addressInfo.chainId,
      sequence: addressInfo.sequence,
      bech32: address.bech32,
      pk: address.pk,
      path: address.path,
    };

    const tx = await ledger.txCreateSend(
      txContext,
      validatorBech32,
      uatomAmount,
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
    if (sing !== null) {
      this.setState({
        txMsg: null,
        txBody: sing,
        stage: STAGE_SUBMITTED,
      });
      await this.injectTx();
    }
  };

  injectTx = async () => {
    const { ledger, txBody } = this.state;
    const txSubmit = await ledger.txSubmit(txBody);
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
    const { txHash, ledger } = this.state;
    const { update } = this.props;
    if (txHash !== null) {
      this.setState({ stage: STAGE_CONFIRMING });
      const status = await ledger.txStatus(txHash);
      const data = await status;
      if (data.logs && data.logs[0].success === true) {
        this.setState({
          stage: STAGE_CONFIRMED,
          txHeight: data.height,
        });

        return;
      }
    }
    this.timeOut = setTimeout(this.confirmTx, 1500);
  };

  tryConnect = async () => {
    const { ledger } = this.state;
    const connect = await ledger.connect();
    return connect;
  };

  cleatState = () => {
    const { update } = this.props;
    this.setState({
      stage: STAGE_SELECTION,
      ledger: null,
      ledgerVersion: [0, 0, 0],
      returnCode: null,
      addressInfo: null,
      address: null,
      availableStake: 0,
      time: 0,
      gas: DEFAULT_GAS,
      gasPrice: DEFAULT_GAS_PRICE,
      toSend: '',
      txBody: null,
      txContext: null,
      txHash: null,
      txHeight: null,
      height50: false,
    });
    if (update) {
      update();
    }
  };

  onChangeSelect = e =>
    this.setState({
      valueSelect: e.target.value,
    });

  onClickFuckGoogle = () => {
    this.setState({
      stage: STAGE_SELECTION,
      height50: true,
    });
  };

  onClickTrackContribution = () => {
    this.setState({
      stage: STAGE_LEDGER_INIT,
    });

    this.tryConnect().then(connect => {
      console.log('connect status', connect);
      this.setState({
        connect,
      });
      // if (connect === undefined) {
      //   this.onClickTrackContribution();
      // }
    });
  };

  onClickSaveAddress = () => {
    this.tryConnect().then(connect => {
      console.log('connect status', connect);
      if (connect === undefined) {
        this.onClickSaveAddress();
        return;
      }
      if (connect !== undefined) {
        this.setState({
          connect,
        });
        if (connect.app === false) {
          this.onClickSaveAddress();
        }
      }
      this.setState({
        connect,
      });
    });
  };

  onChangeInputContributeATOMs = async e => {
    this.setState({
      toSend: e.target.value,
    });
  };

  onClickMax = () => {
    const { gas, gasPrice } = this.state;
    this.setState(prevState => ({
      toSend:
        Math.floor(
          ((prevState.availableStake - gas * gasPrice) / DIVISOR_ATOM) * 1000
        ) / 1000,
    }));
  };

  onClickContributeATOMs = () =>
    this.setState({
      step: 'transactionCost',
    });

  onClickTransactionCost = () =>
    this.setState({
      step: 'succesfuuly',
    });

  hasKey() {
    const { address } = this.state;
    return address !== null;
  }

  hasWallet() {
    const { addressInfo } = this.state;
    return addressInfo !== null;
  }

  render() {
    const {
      valueSelect,
      step,
      height50,
      connect,
      returnCode,
      version,
      availableStake,
      address,
      gasPrice,
      gas,
      toSend,
      txMsg,
      txHash,
      txHeight,
      stage,
    } = this.state;
    const { valueAmount } = this.props;

    if (stage === STAGE_SELECTION) {
      return (
        <SendAmount
          height={height50}
          onClickBtn={this.onClickTrackContribution}
          address={ADDR_FUNDING}
          onClickBtnCloce={this.cleatState}
        />
      );
    }

    if (stage === STAGE_LEDGER_INIT) {
      return (
        <ConnectLadger
          onClickBtn={this.onClickSaveAddress}
          status={connect}
          pin={returnCode >= LEDGER_NOAPP}
          app={returnCode === LEDGER_OK}
          onClickBtnCloce={this.cleatState}
          version={
            returnCode === LEDGER_OK &&
            this.compareVersion(version, LEDGER_VERSION_REQ)
          }
          address={ADDR_FUNDING}
        />
      );
    }

    if (stage === STAGE_READY && this.hasKey() && this.hasWallet()) {
      return (
        <SendLedgerAtomTot
          onClickBtn={() => this.generateTx()}
          address={address.bech32}
          addressTo={ADDR_FUNDING}
          amount={valueAmount}
          availableStake={
            Math.floor((availableStake / DIVISOR_ATOM) * 1000) / 1000
          }
          onClickBtnCloce={this.cleatState}
        />
      );
    }

    if (stage === STAGE_WAIT) {
      return (
        <JsonTransaction
          txMsg={txMsg}
          onClickBtnCloce={this.cleatState}
        />
      );
    }

    if (stage === STAGE_SUBMITTED || stage === STAGE_CONFIRMING) {
      return <TransactionSubmitted onClickBtnCloce={this.cleatState} />;
    }

    if (stage === STAGE_CONFIRMED) {
      return (
        <Confirmed
          txHash={txHash}
          explorer="cosmos.bigdipper.live"
          txHeight={txHeight}
          onClickBtn={this.cleatState}
          onClickBtnCloce={this.cleatState}
        />
      );
    }

    return null;
  }
}

export default ActionBarAtom;
