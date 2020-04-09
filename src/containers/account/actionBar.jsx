import React, { Component } from 'react';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { Pane, Text, ActionBar, Button } from '@cybercongress/gravity';
import LocalizedStrings from 'react-localization';
import { CosmosDelegateTool } from '../../utils/ledger';
import {
  JsonTransaction,
  TransactionSubmitted,
  Confirmed,
  SendLedger,
  ConnectLadger,
  RewardsDelegators,
  Cyberlink,
  StartStageSearchActionBar,
  TransactionError,
} from '../../components';
import { LEDGER, CYBER } from '../../utils/config';

import {
  getBalanceWallet,
  getTotalRewards,
  getIpfsHash,
} from '../../utils/search/utils';

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
      contentHash: '',
      txBody: null,
      txContext: null,
      txMsg: null,
      txHash: null,
      txHeight: null,
      rewards: null,
      errorMessage: null,
      bandwidth: {
        remained: 0,
        max_value: 0,
      },
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
      this.setState({
        ledger: null,
      });
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
      const response = await fetch(`${CYBER_NODE_URL}/api/status`, {
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
    const { addressSend } = this.props;
    let toSendAddres = '';
    let addressInfo = {};
    let balance = 0;
    try {
      const response = await getBalanceWallet(address.bech32);
      const chainId = await this.getNetworkId();

      this.getBandwidth();

      if (response) {
        const data = response;
        addressInfo = data.account;
        balance = addressInfo.coins[0].amount;
      }
      addressInfo.chainId = chainId;

      if (addressSend) {
        toSendAddres = addressSend;
      }

      const dataTotalRewards = await getTotalRewards(address.bech32);

      this.setState({
        addressInfo,
        toSendAddres,
        balance,
        stage: STAGE_READY,
        rewards: dataTotalRewards,
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

  getBandwidth = async () => {
    try {
      const { address } = this.state;

      const bandwidth = {
        remained: 0,
        max_value: 0,
      };

      const getBandwidth = await fetch(
        `${CYBER_NODE_URL}/api/account_bandwidth?address="${address.bech32}"`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await getBandwidth.json();

      bandwidth.remained = data.result.remained;
      bandwidth.max_value = data.result.max_value;

      this.setState({
        bandwidth,
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

  getTxType = async (type, txContext) => {
    const {
      ledger,
      address,
      addressInfo,
      toSend,
      rewards,
      toSendAddres,
      contentHash,
    } = this.state;
    const { addressSend } = this.props;
    const uatomAmount = toSend * DIVISOR_CYBER_G;

    const { denom } = addressInfo.coins[0];

    let tx;

    if (type === 'heroes') {
      tx = await ledger.withdrawDelegationReward(
        txContext,
        address.bech32,
        MEMO,
        rewards.rewards
      );
    } else if (type === 'cyberlink') {
      const fromCid = await getIpfsHash(addressSend);
      const toCid = contentHash;
      tx = await ledger.txCreateLink(
        txContext,
        address.bech32,
        fromCid,
        toCid,
        MEMO
      );
    } else {
      tx = await ledger.txCreateSendCyber(
        txContext,
        toSendAddres,
        uatomAmount,
        MEMO,
        denom
      );
    }
    return tx;
  };

  generateTx = async () => {
    const { address, addressInfo } = this.state;
    const { type } = this.props;

    const txContext = {
      accountNumber: addressInfo.account_number,
      chainId: addressInfo.chainId,
      sequence: addressInfo.sequence,
      bech32: address.bech32,
      pk: address.pk,
      path: address.path,
    };

    const tx = await this.getTxType(type, txContext);

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
    const { updateAddress } = this.props;
    if (this.state.txHash !== null) {
      this.setState({ stage: STAGE_CONFIRMING });
      const status = await this.state.ledger.txStatusCyber(this.state.txHash);
      const data = await status;
      if (data.logs) {
        this.setState({
          stage: STAGE_CONFIRMED,
          txHeight: data.height,
        });
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

  onChangeInput = async e => {
    const { value } = e.target;
    this.setState({
      contentHash: value,
    });
  };

  hasKey() {
    return this.state.address !== null;
  }

  hasWallet() {
    return this.state.addressInfo !== null;
  }

  render() {
    const { type, addressSend, addressLedger } = this.props;
    const {
      stage,
      address,
      returnCode,
      ledgerVersion,
      toSend,
      balance,
      toSendAddres,
      txMsg,
      txHash,
      txHeight,
      rewards,
      bandwidth,
      contentHash,
      errorMessage,
    } = this.state;

    if (stage === STAGE_INIT && (type === 'main' || type === 'txs')) {
      return (
        <ActionBar>
          <Pane>
            <Button onClick={e => this.onClickSend(e)}>
              {T.actionBar.pocket.send}
            </Button>
          </Pane>
        </ActionBar>
      );
    }

    if (stage === STAGE_INIT && (type === 'cyberlink' || type === 'mentions')) {
      return (
        <StartStageSearchActionBar
          onClickBtn={this.onClickSend}
          contentHash={contentHash}
          onChangeInputContentHash={this.onChangeInput}
        />
      );
    }

    if (stage === STAGE_INIT && type === 'heroes') {
      return (
        <ActionBar>
          <Pane>
            <Button
              disabled={addressSend !== addressLedger}
              onClick={e => this.onClickSend(e)}
            >
              Claim rewards
            </Button>
          </Pane>
        </ActionBar>
      );
    }

    if (stage === STAGE_LEDGER_INIT) {
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

    if (stage === STAGE_READY && this.hasKey() && this.hasWallet()) {
      // if (this.state.stage === STAGE_READY) {
      if (type === 'heroes') {
        return (
          <RewardsDelegators
            data={rewards}
            onClickBtnCloce={this.cleatState}
            address={address.bech32}
            onClickBtn={this.generateTx}
          />
        );
      }
      if (type === 'cyberlink') {
        return (
          <Cyberlink
            onClickBtnCloce={this.cleatState}
            query={addressSend}
            onClickBtn={this.generateTx}
            bandwidth={bandwidth}
            address={address.bech32}
            contentHash={contentHash}
            disabledBtn={parseFloat(bandwidth.max_value) === 0}
          />
        );
      }
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
