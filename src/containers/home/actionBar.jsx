import React, { Component } from 'react';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { Pane, Text, ActionBar, Button } from '@cybercongress/gravity';
import { CosmosDelegateTool } from '../../utils/ledger';
import {
  SendAmounLadger,
  JsonTransaction,
  TransactionSubmitted,
  Confirmed,
  StartState,
  NoResultState,
} from './stateActionBar';
import { ContainetLedger } from '../../components';

import { indexedNode, MEMO } from '../../utils/config';

const TIMEOUT = 5000;
const HDPATH = [44, 118, 0, 0, 0];
const LEDGER_OK = 36864;
const LEDGER_NOAPP = 28160;

const STAGE_INIT = 0;
const STAGE_SELECTION = 1;
const STAGE_LEDGER_INIT = 2;
const STAGE_READY = 3;
const STAGE_WAIT = 4;
const STAGE_GENERATED = 5;
const STAGE_SUBMITTED = 6;
const STAGE_CONFIRMING = 7;
const STAGE_CONFIRMED = 8;
const STAGE_ERROR = 15;

const CHAIN_ID = 'euler-dev';

const LEDGER_VERSION_REQ = [1, 1, 1];

class ActionBarContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
      init: false,
      ledger: null,
      address: null,
      returnCode: null,
      addressInfo: null,
      ledgerVersion: [0, 0, 0],
      time: 0,
      bandwidth: {
        remained: 0,
        max_value: 0,
      },
      contentHash: '',
      txMsg: null,
      txContext: null,
      txBody: null,
      txHeight: null,
      txHash: null,
      error: null,
    };
    this.timeOut = null;
    this.haveDocument = typeof document !== 'undefined';
  }

  async componentDidMount() {
    console.warn('Looking for Ledger Nano');
    this.pollLedger();
    // await this.getVersion();
    // await this.getAddress();
    // await this.getAddressInfo();
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
              this.getAddressInfo();
            }
            break;
          default:
            console.log('getVersion');
            this.getVersion();
            break;
        }
      } else {
        // eslint-disable-next-line
        console.warn('Still looking for a Ledger device.');
      }
    }
  }

  init = async () => {
    const { stage, ledger, address, addressInfo, returnCode } = this.state;

    await this.setState({
      stage: STAGE_LEDGER_INIT,
      init: true,
    });

    if (ledger === null) {
      this.pollLedger();
    }

    if (ledger !== null) {
      await this.getVersion();
    }
  };

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
      if (returnCode === null || connect.return_code !== returnCode) {
        this.setState({
          address: null,
          returnCode: connect.return_code,
          ledgerVersion: [connect.major, connect.minor, connect.patch],
          txMsg: null,
          txBody: null,
          errorMessage: null,
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
    try {
      const { ledger } = this.state;

      const address = await ledger.retrieveAddressCyber(HDPATH);

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
    try {
      const { ledger, address } = this.state;

      this.getBandwidth();

      const addressInfo = await ledger.getAccountInfoCyber(address);
      const chainId = await this.getNetworkId();

      addressInfo.chainId = chainId;

      this.setState({
        addressInfo,
        stage: STAGE_READY,
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

  getBandwidth = async () => {
    try {
      const { address } = this.state;

      const bandwidth = {
        remained: 0,
        max_value: 0,
      };

      const getBandwidth = await fetch(
        `${indexedNode}/api/account_bandwidth?address="${address.bech32}"`,
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

  // link = async () => {
  //   const { valueInput } = this.state;
  //   console.log('valueInput', valueInput);
  // };

  link = async () => {
    const { address, addressInfo, ledger, contentHash } = this.state;

    const { keywordHash } = this.props;

    const fromCid = keywordHash;
    const toCid = contentHash;

    const txContext = {
      accountNumber: addressInfo.accountNumber,
      chainId: addressInfo.chainId,
      sequence: addressInfo.sequence,
      bech32: address.bech32,
      pk: address.pk,
      path: address.path,
    };

    const tx = await ledger.txCreateLink(
      txContext,
      address.bech32,
      fromCid,
      toCid,
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
    if (this.state.txHash !== null) {
      this.setState({ stage: STAGE_CONFIRMING });
      const status = await this.state.ledger.txStatusCyber(this.state.txHash);
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

  onChangeInput = async e => {
    const { value } = e.target;
    this.setState({
      contentHash: value,
    });
  };

  cleatState = () => {
    this.setState({
      ledger: null,
      address: null,
      returnCode: null,
      addressInfo: null,
      txMsg: null,
      ledgerVersion: [0, 0, 0],
      time: 0,
      bandwidth: {
        remained: 0,
        max_value: 0,
      },
      contentHash: '',
      txContext: null,
      txBody: null,
      txHeight: null,
      txHash: null,
      error: null,
      init: false,
    });
    this.timeOut = null;
  };

  onClickInitStage = () => {
    this.cleatState();
    this.setState({
      stage: STAGE_INIT,
    });
  };

  onClickUsingLedger = () => {
    this.init();
  };

  hasKey() {
    return this.state.address !== null;
  }

  hasWallet() {
    return this.state.addressInfo !== null;
  }

  render() {
    const {
      address,
      bandwidth,
      contentHash,
      returnCode,
      ledgerVersion,
      stage,
      txMsg,
      txHeight,
      txHash,
      ledger,
    } = this.state;
    const {
      link,
      home,
      valueSearchInput,
      targetColor,
      onCklicBtnSearch,
    } = this.props;

    if (home && stage === STAGE_INIT) {
      return (
        <StartState
          targetColor={targetColor}
          valueSearchInput={valueSearchInput}
          onClickBtn={onCklicBtnSearch}
        />
      );
    }

    if (link && stage === STAGE_INIT) {
      return (
        <NoResultState
          valueSearchInput={valueSearchInput}
          onClickBtn={this.onClickUsingLedger}
        />
      );
    }

    if (stage === STAGE_LEDGER_INIT) {
      return (
        <SendAmounLadger
          pin={returnCode >= LEDGER_NOAPP}
          app={returnCode === LEDGER_OK}
          onClickBtnCloce={this.onClickInitStage}
          version={
            returnCode === LEDGER_OK &&
            this.compareVersion(ledgerVersion, LEDGER_VERSION_REQ)
          }
        />
      );
    }

    if (stage === STAGE_READY && this.hasKey() && this.hasWallet()) {
      // if (stage === STAGE_READY) {
      // if (this.state.stage === STAGE_READY) {
      return (
        <ContainetLedger onClickBtnCloce={this.onClickInitStage}>
          <Pane
            marginBottom={20}
            textAlign="center"
            display="flex"
            flexDirection="column"
          >
            <Text fontSize="25px" lineHeight="40px" color="#fff">
              Address
            </Text>
            <Text fontSize="16px" lineHeight="25.888px" color="#fff">
              {address.bech32}
            </Text>
          </Pane>
          <Pane
            marginBottom={25}
            textAlign="center"
            display="flex"
            flexDirection="column"
          >
            <Text fontSize="25px" lineHeight="40px" color="#fff">
              Bandwidth
            </Text>
            <Text fontSize="16px" lineHeight="25.888px" color="#3ab793">
              {bandwidth.remained}/{bandwidth.max_value}
            </Text>
          </Pane>
          <Pane>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <input
                value={contentHash}
                style={{ height: 42, marginBottom: '20px', width: '100%' }}
                onChange={e => this.onChangeInput(e)}
                placeholder="Content hash"
              />
              <button
                type="button"
                className="btn"
                onClick={e => this.link(e)}
                style={{ height: 42, maxWidth: '200px' }}
              >
                Cyber it
              </button>
            </div>
          </Pane>
        </ContainetLedger>
      );
    }

    if (stage === STAGE_WAIT) {
      return (
        <JsonTransaction
          txMsg={txMsg}
          onClickBtnCloce={this.onClickInitStage}
        />
      );
    }

    if (stage === STAGE_SUBMITTED || stage === STAGE_CONFIRMING) {
      return <TransactionSubmitted onClickBtnCloce={this.onClickInitStage} />;
    }

    if (stage === STAGE_CONFIRMED) {
      return (
        <Confirmed
          txHash={txHash}
          txHeight={txHeight}
          onClickBtn={this.onClickInitStage}
          onClickBtnCloce={this.onClickInitStage}
        />
      );
    }

    return null;
  }
}

export default ActionBarContainer;
