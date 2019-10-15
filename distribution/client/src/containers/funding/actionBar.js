import React, { Component } from 'react';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { CosmosDelegateTool } from '../../utils/ledger';
import {
  OPERATOR_ADDR,
  MEMO,
  DEFAULT_GAS,
  DEFAULT_GAS_PRICE
} from '../../utils/config';
import {
  ContributeATOMs,
  TransactionCost,
  Succesfuuly,
  SendAmounLadger,
  SendAmount,
  StartState,
  JsonTransaction,
  Confirmed,
  TransactionSubmitted
} from './stateActionBar';

const HDPATH = [44, 118, 0, 0, 0];
const TIMEOUT = 5000;
export const DIVISOR = 1000000;
// const DEFAULT_GAS = 150000;
// const DEFAULT_GAS_PRICE = 0.01;
const DENOM = 'uatom';
// const MEMO = 'Send to Cyber~Congress';
// const OPERATOR_ADDR = 'cosmos1kajt7sxfpnfujm7ptj90654lmwz4sftpmk0jm6';

const STAGE_INIT = 0;
const STAGE_SELECTION = 1;
const STAGE_LEDGER_INIT = 2;
// const STAGE_COMMSOPEN = 1;
// const STAGE_UNLOCKED = 2;
const STAGE_READY = 3;
const STAGE_WAIT = 4;
const STAGE_GENERATED = 5;
const STAGE_SUBMITTED = 6;
const STAGE_CONFIRMING = 7;
const STAGE_CONFIRMED = 8;
const STAGE_ERROR = 15;

// const API_ROOT = 'https://moon.cybernode.ai';
const API_ROOT = 'https://api.chorus.one/';

export const TXTYPE_DELEGATE = 0;
export const TXTYPE_REDELEGATE = 1;
export const TXTYPE_WITHDRAW = 2;
export const TXTYPE_GOVERNANCE_VOTE = 3;
export const TXTYPE_GOVERNANCE_VOTE_TX = 4;

const LEDGER_OK = 36864;
const LEDGER_NOAPP = 28160;

const LEDGER_VERSION_REQ = [1, 1, 1];

const ActionBarContainer = ({ height, children }) => (
  <div className={`container-action ${height ? 'height50' : ''} `}>
    {children}
  </div>
);

function formatAtom(amount, dp) {
  console.log(amount);
  console.log(dp);
  return amount;
  // return formatDenomination(amount, dp, "ATOM", "ATOMs");
}

export class ActionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
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
      canStake: 0,
      atomerror: null,
      errorMessage: null,
      rewards: [],
      governance: [],
      txBody: null,
      txContext: null,
      txHash: null,
      txHeight: null,
      textAreaRef: React.createRef(),
      clipboardCopySuccess: false,
      height50: false,
    };
    this.ledgerModal = React.createRef();
    this.atomField = React.createRef();
    this.gasField = React.createRef();
    this.gasPriceField = React.createRef();
    this.timeOut = null;
    this.haveDocument = typeof document !== 'undefined';
  }

  compareVersion = async () => {
    const test = this.state.ledgerVersion;
    const target = LEDGER_VERSION_REQ;
    const testInt = 10000 * test[0] + 100 * test[1] + test[2];
    const targetInt = 10000 * target[0] + 100 * target[1] + target[2];
    return testInt >= targetInt;
  };

  componentDidMount() {
    this.setState({ txType: this.props.txType });
    // eslint-disable-next-line
        console.warn('Looking for Ledger Nano');
    this.pollLedger();
  }

  componentWillUpdate() {
    if (this.state.ledger === null) {
      this.pollLedger();
    }
    if (this.state.stage === STAGE_LEDGER_INIT) {
      if (this.state.ledger !== null) {
        switch (this.state.returnCode) {
          case LEDGER_OK:
            if (this.state.address === null) {
              this.getAddress();
            }
            if (
              this.state.address !== null &&
              this.state.addressInfo === null
            ) {
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

  pollLedger = async () => {
    const transport = await TransportU2F.create(TIMEOUT, true);
    this.setState({ ledger: new CosmosDelegateTool(transport) });
  };

  getVersion = async () => {
    try {
      const connect = await this.state.ledger.connect();
      if (
        this.state.returnCode === null ||
        connect.return_code !== this.state.returnCode
      ) {
        this.setState({
          txMsg: null,
          address: null,
          requestMetaData: null,
          txBody: null,
          errorMessage: null,
          returnCode: connect.return_code,
          version_info: [connect.major, connect.minor, connect.patch]
        });
        // eslint-disable-next-line
                console.warn('Ledger app return_code', this.state.returnCode);
      } else {
        this.setState({ time: Date.now() }); // cause componentWillUpdate to call again.
      }
    } catch ({ message, statusCode }) {
      // eslint-disable-next-line
            // eslint-disable-next-line
            console.error(
                'Problem with Ledger communication',
                message,
                statusCode
            );
    }
  };

  getAddress = async () => {
    // try {
    const address = await this.state.ledger.retrieveAddress(0, 0);
    console.log('address', address);
    // eslint-disable-next-line
        // const pk = (await this.state.ledger.publicKey(HDPATH)).pk;
    this.setState({
      // eslint-disable-next-line
            // cpk: this.state.ledger.compressPublicKey(pk),
      address
    });
    // } catch (error) {
    //   const { message, statusCode } = error;
    //   if (message !== "Cannot read property 'length' of undefined") {
    //     // this just means we haven't found the device yet...
    //     // eslint-disable-next-line
    //     console.error("Problem reading address data", message, statusCode);
    //   }
    //   this.setState({ time: Date.now() }); // cause componentWillUpdate to call again.
    // }
  };

  getWallet = async () => {
    const addressInfo = await this.state.ledger.getAccountInfo(
      this.state.address
    );
    // console.log('addressInfo', addressInfo);
    // const addressInfo = await fetch(
    //   `${API_ROOT}/api/account?address="${this.state.address.bech32}"`,
    //   {
    //     method: 'GET',
    //     headers: {
    //       Accept: 'application/json',
    //       'Content-Type': 'application/json'
    //     }
    //   }
    // );
    // const data = await addressInfo.json();
    // console.log('addressInfo', data);
    // console.log('data', data.result.account.coins[0].amount);
    switch (this.state.txType) {
      case TXTYPE_WITHDRAW:
        this.getRewards();
        break;
      case TXTYPE_GOVERNANCE_VOTE:
        this.getGovernanceProposals();
        break;
      default:
        break;
    }

    this.setState(prevState => ({
      addressInfo,
      availableStake: parseFloat(addressInfo.balanceuAtom),
      canStake:
        parseFloat(addressInfo.balanceuAtom) -
        prevState.gas * prevState.gasPrice,
      stage: STAGE_READY
    }));

    // console.log('addressInfo', addressInfo);
  };

  generateTx = async () => {
    const { ledger, address, addressInfo } = this.state;
    const validatorBech32 = OPERATOR_ADDR;
    const uatomAmount = this.state.toSend * DIVISOR;
    const txContext = {
      accountNumber: addressInfo.accountNumber,
      balanceuAtom: addressInfo.balanceuAtom,
      chainId: addressInfo.chainId,
      sequence: addressInfo.sequence,
      bech32: address.bech32,
      pk: address.pk,
      path: address.path
    };
    // console.log('txContext', txContext);
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
      error: null
    });
    // debugger;
    this.signTx();

    // const sing = await ledger.sign(tx, txContext);
    // console.log('sing', sing);
    // const txSubmit = await ledger.txSubmit(sing);
    // console.log('txSubmit', txSubmit);
    // console.log('tx', txSubmit.data.txhash);
    // if (txSubmit) {
    //   const status = await ledger.txStatus(txSubmit.data.txhash);
    //   console.log(status);
    // }
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
        stage: STAGE_SUBMITTED
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
    if (this.state.txHash !== null) {
      this.setState({ stage: STAGE_CONFIRMING });
      const status = await this.state.ledger.txStatus(this.state.txHash);
      const data = await status;
      if (data.logs && data.logs[0].success === true) {
        this.setState({
          stage: STAGE_CONFIRMED,
          txHeight: data.height
        });
        return;
      }
    }
    this.timeOut = setTimeout(this.confirmTx, 1500);
  };

  tryConnect = async () => {
    const connect = await this.state.ledger.connect();
    return connect;
  };

  cleatState = () => {
    this.setState({
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
      canStake: 0,
      atomerror: null,
      errorMessage: null,
      rewards: [],
      governance: [],
      txBody: null,
      txContext: null,
      txHash: null,
      txHeight: null,
      textAreaRef: React.createRef(),
      clipboardCopySuccess: false,
      height50: false
    });
  };

  onChangeSelect = e =>
    this.setState({
      valueSelect: e.target.value
    });

  onClickFuckGoogle = () => {
    this.setState({
      stage: STAGE_SELECTION,
      height50: true
    });
  };

  onClickInitStage = () => {
    this.cleatState();
    this.setState({
      stage: STAGE_INIT
    });
  };

  onClickTrackContribution = () => {
    this.setState({
      stage: STAGE_LEDGER_INIT
    });

    this.tryConnect().then(connect => {
      console.log('connect status', connect);
      this.setState({
        connect
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
          connect
        });
        if (connect.app === false) {
          this.onClickSaveAddress();
        }
      }
      this.setState({
        connect
      });
    });
  };

  onChangeInputContributeATOMs = async e => {
    this.setState({
      toSend: e.target.value
    });
  };

  onClickMax = () =>
    this.setState(prevState => ({
      toSend:
        Math.floor(
          ((prevState.availableStake - this.state.gas * this.state.gasPrice) /
            DIVISOR) *
            1000
        ) / 1000
    }));

  onClickContributeATOMs = () =>
    this.setState({
      step: 'transactionCost'
    });

  onClickTransactionCost = () =>
    this.setState({
      step: 'succesfuuly'
    });

  hasKey() {
    return this.state.address !== null;
  }

  hasWallet() {
    return this.state.addressInfo !== null;
  }

  // copyToClipboard() {
  //   this.state.textAreaRef.current.select();
  //   document.execCommand("copy");
  //   this.setState({ clipboardCopySuccess: true });
  //   setTimeout(() => {
  //     this.setState({ clipboardCopySuccess: false });
  //   }, 2000);
  // }

  render() {
    const {
      valueSelect,
      step,
      height50,
      connect,
      ledger,
      returnCode,
      version_info,
      version,
      availableStake,
      canStake,
      address,
      gasPrice,
      gas,
      toSend,
      txMsg,
      txHash,
      txHeight
    } = this.state;

    if (this.state.stage === STAGE_INIT) {
      return (
        <StartState
          onClickBtn={this.onClickFuckGoogle}
          valueSelect={valueSelect}
          onChangeSelect={this.onChangeSelect}
        />
      );
    }

    if (this.state.stage === STAGE_SELECTION) {
      return (
        <SendAmount
          height={height50}
          onClickBtn={this.onClickTrackContribution}
          address={OPERATOR_ADDR}
          onClickBtnCloce={this.onClickInitStage}
        />
      );
    }

    if (this.state.stage === STAGE_LEDGER_INIT) {
      return (
        <SendAmounLadger
          onClickBtn={this.onClickSaveAddress}
          status={connect}
          pin={returnCode >= LEDGER_NOAPP}
          app={returnCode === LEDGER_OK}
          onClickBtnCloce={this.onClickInitStage}
          version={
            this.state.returnCode === LEDGER_OK &&
            this.compareVersion(version, LEDGER_VERSION_REQ)
          }
          address={OPERATOR_ADDR}
        />
      );
    }

    if (this.state.stage === STAGE_READY && this.hasKey() && this.hasWallet()) {
      // if (this.state.stage === STAGE_READY) {
      return (
        <ContributeATOMs
          onClickBtn={() => this.generateTx()}
          address={address.bech32}
          availableStake={Math.floor((availableStake / DIVISOR) * 1000) / 1000}
          gasUAtom={gas * gasPrice}
          gasAtom={(gas * gasPrice) / DIVISOR}
          onChangeInput={e => this.onChangeInputContributeATOMs(e)}
          valueInput={toSend}
          onClickBtnCloce={this.onClickInitStage}
          onClickMax={this.onClickMax}
        />
        //   <ContributeATOMs
        //     onClickBtn={this.onClickContributeATOMs}
        //     address='cosmos1gw5kdey7fs9wdh05w66s0h4s24tjdvtcxlwll7'
        //     availableStake={Math.floor(0.05851 * 1000) / 1000}
        //     canStake={Math.floor(0.05701 * 1000) / 1000}
        //     valueInput={Math.floor(0.05701 * 1000) / 1000}
        //     gasUAtom={gas * gasPrice}
        //     gasAtom={(gas * gasPrice) / DIVISOR}
        // />
      );
    }

    if (this.state.stage === STAGE_WAIT) {
      return (
        <JsonTransaction
          txMsg={txMsg}
          onClickBtnCloce={this.onClickInitStage}
        />
      );
    }

    if (
      this.state.stage === STAGE_SUBMITTED ||
      this.state.stage === STAGE_CONFIRMING
    ) {
      return <TransactionSubmitted onClickBtnCloce={this.onClickInitStage} />;
    }

    if (this.state.stage === STAGE_CONFIRMED) {
      return (
        <Confirmed
          txHash={txHash}
          txHeight={txHeight}
          onClickBtn={this.onClickInitStage}
          onClickBtnCloce={this.onClickInitStage}
        />
      );
    }

    if (step === 'transactionCost') {
      return <TransactionCost onClickBtn={this.onClickTransactionCost} />;
    }

    if (step === 'succesfuuly') {
      return <Succesfuuly />;
    }

    return null;
  }
}
