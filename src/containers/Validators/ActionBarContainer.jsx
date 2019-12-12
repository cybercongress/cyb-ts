import React, { Component } from 'react';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { Pane, Text, ActionBar, Button } from '@cybercongress/gravity';
import LocalizedStrings from 'react-localization';
import { CosmosDelegateTool, compareVersion } from '../../utils/ledger';
import {
  SendAmounLadger,
  JsonTransaction,
  ConnectLadger,
  Confirmed,
  StartState,
  NoResultState,
  ContainetLedger,
  FormatNumber,
  TransactionSubmitted,
} from '../../components';

import { formatValidatorAddress, formatNumber } from '../../utils/utils';

import { LEDGER, CYBER } from '../../utils/config';

import { i18n } from '../../i18n/en';

const { CYBER_NODE_URL, DENOM_CYBER, DIVISOR_CYBER_G, DENOM_CYBER_G } = CYBER;
const {
  MEMO,
  HDPATH,
  LEDGER_OK,
  LEDGER_NOAPP,
  STAGE_INIT,
  STAGE_LEDGER_INIT,
  STAGE_READY,
  STAGE_WAIT,
  STAGE_SUBMITTED,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
  STAGE_ERROR,
} = LEDGER;

const T = new LocalizedStrings(i18n);

const ActionBarContentText = ({ children, ...props }) => (
  <Pane
    display="flex"
    fontSize="20px"
    justifyContent="center"
    alignItems="center"
    flexGrow={1}
    marginRight="15px"
    {...props}
  >
    {children}
  </Pane>
);

class ActionBarContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
      ledger: null,
      address: null,
      returnCode: null,
      addressInfo: null,
      ledgerVersion: [0, 0, 0],
      balance: 0,
      time: 0,
      toSend: '',
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

  componentDidUpdate() {
    const { ledger, stage, returnCode, address, addressInfo } = this.state;

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
    let addressInfo;

    try {
      const response = await fetch(
        `${CYBER_NODE_URL}/api/account?address="${address.bech32}"`,
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
    const { ledger, address, addressInfo, toSend } = this.state;
    const { validators } = this.props;

    const validatorAddres = validators[0].operator_address;

    console.log(validatorAddres);

    const amount = toSend * DIVISOR_CYBER_G;

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
    const tx = await ledger.txCreateDelegateCyber(
      txContext,
      validatorAddres,
      amount,
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
    const { updateTable } = this.props;
    if (this.state.txHash !== null) {
      this.setState({ stage: STAGE_CONFIRMING });
      const status = await this.state.ledger.txStatusCyber(this.state.txHash);
      const data = await status;
      if (data.logs && data.logs[0].success === true) {
        this.setState({
          stage: STAGE_CONFIRMED,
          txHeight: data.height,
        });
        updateTable();
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

  toStageConnectLadger = () => {
    this.setState({
      stage: STAGE_LEDGER_INIT,
    });
  };

  cleatState = () => {
    this.setState({
      stage: STAGE_INIT,
      ledger: null,
      address: null,
      returnCode: null,
      addressInfo: null,
      txMsg: null,
      ledgerVersion: [0, 0, 0],
      time: 0,
      txContext: null,
      txBody: null,
      txHeight: null,
      txHash: null,
      error: null,
    });
    this.timeOut = null;
  };

  hasKey() {
    return this.state.address !== null;
  }

  hasWallet() {
    return this.state.addressInfo !== null;
  }

  onClickMax = () =>
    this.setState(prevState => ({
      toSend: prevState.balance / DIVISOR_CYBER_G,
    }));

  render() {
    const { validators } = this.props;
    const {
      stage,
      ledgerVersion,
      returnCode,
      address,
      balance,
      toSend,
      txMsg,
      txHash,
      txHeight,
    } = this.state;

    if (validators.length === 0 && stage === STAGE_INIT) {
      return (
        <ActionBar>
          <ActionBarContentText>
            <Text fontSize="18px" color="#fff">
              {T.validators.actionBar.joinValidator}
            </Text>
          </ActionBarContentText>
          <a
            className="btn"
            target="_blank"
            href="https://cybercongress.ai/docs/cyberd/run_validator/"
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {T.validators.actionBar.btnBecome}
          </a>
        </ActionBar>
      );
    }

    if (validators.length > 0 && stage === STAGE_INIT) {
      return (
        <ActionBar>
          <ActionBarContentText>
            <Text fontSize="18px" color="#fff" marginRight={5}>
              Delegate to
            </Text>
            <Text fontSize="18px" color="#fff" fontWeight={600}>
              {validators[0].description.moniker}
            </Text>
          </ActionBarContentText>
          <Button onClick={this.toStageConnectLadger}>
            Delegate with Ledger
          </Button>
        </ActionBar>
      );
    }

    if (stage === STAGE_LEDGER_INIT) {
      return (
        <ConnectLadger
          pin={returnCode >= LEDGER_NOAPP}
          app={returnCode === LEDGER_OK}
          version={returnCode === LEDGER_OK && compareVersion(ledgerVersion)}
          onClickBtnCloce={this.cleatState}
        />
      );
    }

    if (stage === STAGE_READY && this.hasKey() && this.hasWallet()) {
      // if (stage === STAGE_READY) {
      // if (this.state.stage === STAGE_READY) {
      return (
        <ContainetLedger onClickBtnCloce={this.cleatState}>
          <Pane display="flex" flexDirection="column" alignItems="center">
            <Text
              marginBottom={20}
              fontSize="16px"
              lineHeight="25.888px"
              color="#fff"
            >
              {address.bech32}
            </Text>
            <Text fontSize="30px" lineHeight="40px" color="#fff">
              Delegation Details
            </Text>

            <Text fontSize="18px" lineHeight="30px" color="#fff">
              Your wallet contains
            </Text>
            <Text
              display="flex"
              justifyContent="center"
              fontSize="20px"
              lineHeight="25.888px"
              color="#3ab793"
            >
              <FormatNumber
                marginRight={5}
                number={formatNumber(
                  Math.floor((balance / DIVISOR_CYBER_G) * 1000) / 1000,
                  3
                )}
              />
              {(DENOM_CYBER_G + DENOM_CYBER).toUpperCase()}
            </Text>

            <Pane marginTop={20}>
              <Text fontSize="16px" color="#fff">
                Enter the amount of{' '}
                {(DENOM_CYBER_G + DENOM_CYBER).toUpperCase()} you wish to
                delegate to{' '}
                <Text fontSize="20px" color="#fff" fontWeight={600}>
                  {validators[0].description.moniker}
                </Text>
              </Text>
            </Pane>
            <Text color="#fff">{validators[0].operator_address}</Text>
            <Pane marginY={30} display="flex">
              <input
                value={toSend}
                style={{
                  height: 42,
                  width: '60%',
                  marginRight: 20,
                }}
                onChange={e => this.onChangeInputAmount(e)}
                placeholder="amount"
              />
              <button
                type="button"
                className="btn"
                onClick={e => this.onClickMax(e)}
                style={{ height: 42, maxWidth: '200px' }}
              >
                Max
              </button>
            </Pane>
            <button
              type="button"
              className="btn"
              onClick={() => this.generateTx()}
              style={{ height: 42, maxWidth: '200px' }}
            >
              Generate Tx
            </button>
          </Pane>
        </ContainetLedger>
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
