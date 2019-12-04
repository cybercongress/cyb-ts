import React, { Component } from 'react';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { Pane, Text, ActionBar, Button } from '@cybercongress/gravity';
import { CosmosDelegateTool } from '../../utils/ledger';
import {
  OPERATOR_ADDR,
  MEMO,
  DEFAULT_GAS,
  DEFAULT_GAS_PRICE,
  indexedNode,
} from '../../utils/config';

import {
  SendAmounLadger,
  Contribute,
  Confirmed,
  JsonTransaction,
  TransactionSubmitted,
} from './actionBarStage';

const HDPATH = [44, 118, 0, 0, 0];

export const DIVISOR = 10 ** 9;

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

const LEDGER_OK = 36864;
const LEDGER_NOAPP = 28160;

const LEDGER_VERSION_REQ = [1, 1, 1];

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
    };
    this.gasField = React.createRef();
    this.gasPriceField = React.createRef();
    this.timeOut = null;
    this.haveDocument = typeof document !== 'undefined';
  }

  componentDidUpdate() {
    const { stage, ledger, returnCode, address, addressInfo } = this.state;

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
      console.error('Problem with Ledger communication', message, statusCode);
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

  getStatus = async () => {
    try {
      const response = await fetch(`${indexedNode}/api/status`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data.result;
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
    const data = await this.getStatus();
    return data.node_info.network;
  };

  getAddressInfo = async () => {
    const { address } = this.state;
    let addressInfo;

    try {
      const response = await fetch(
        `${indexedNode}/api/account?address="${address.bech32}"`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      const chainId = await this.getNetworkId();

      addressInfo = data.result.account;

      addressInfo.chainId = chainId;

      const balance = addressInfo.coins[0].amount;

      console.log(addressInfo);

      this.setState({
        addressInfo,
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

    const uatomAmount = toSend * DIVISOR;

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
    const txSubmit = await ledger.txSubmitCyberLink(txBody);
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
    const { updateAddress } = this.props;
    if (this.state.txHash !== null) {
      this.setState({ stage: STAGE_CONFIRMING });
      const status = await this.state.ledger.txStatusCyber(this.state.txHash);
      const data = await status;
      if (data.logs && data.logs[0].success === true) {
        this.setState({
          stage: STAGE_CONFIRMED,
          txHeight: data.height,
        });
        updateAddress();
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

  onClickSend = () => {
    this.setState({
      stage: STAGE_LEDGER_INIT,
    });
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
    });
  };

  hasKey() {
    return this.state.address !== null;
  }

  hasWallet() {
    return this.state.addressInfo !== null;
  }

  render() {
    const { onClickAddressLedger, addAddress, send, addressInfo } = this.props;
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
      txHeight,
    } = this.state;

    if (addAddress) {
      return (
        <ActionBar>
          <Pane>
            <Button onClick={onClickAddressLedger}>
              Add address it using Ledger
            </Button>
          </Pane>
        </ActionBar>
      );
    }
    if (!addAddress && stage === STAGE_INIT) {
      return (
        <ActionBar>
          <Pane>
            <Button onClick={e => this.onClickSend(e)}>
              Send it using Ledger
            </Button>
          </Pane>
        </ActionBar>
      );
    }

    if (stage === STAGE_LEDGER_INIT) {
      return (
        <SendAmounLadger
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

    if (stage === STAGE_READY && this.hasKey() && this.hasWallet()) {
      // if (this.state.stage === STAGE_READY) {
      return (
        <Contribute
          onClickBtn={() => this.generateTx()}
          address={address.bech32}
          availableStake={Math.floor((balance / DIVISOR) * 1000) / 1000}
          onChangeInputAmount={e => this.onChangeInputAmount(e)}
          valueInputAmount={toSend}
          onClickBtnCloce={this.cleatState}
          valueInputAddressTo={toSendAddres}
          onChangeInputAddressTo={e => this.onChangeInputInputAddressT(e)}
          disabledBtn={toSend.length === 0 || toSendAddres.length === 0}
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

    return null;
  }
}

export default ActionBarContainer;
