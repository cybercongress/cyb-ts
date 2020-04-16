import React, { Component } from 'react';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { ActionBar, Input, Button, Pane } from '@cybercongress/gravity';
import { CosmosDelegateTool } from '../../utils/ledger';
import {
  ConnectLadger,
  JsonTransaction,
  TransactionSubmitted,
  Confirmed,
  GovernanceStartStageActionBar,
  Cyberlink,
  CommunityPool,
  ParamChange,
  TextProposal,
  TransactionError,
  ActionBarContentText,
  Dots,
} from '../../components';

import { downloadObjectAsJson } from '../../utils/utils';

import { statusNode } from '../../utils/search/utils';

import { LEDGER, CYBER, PATTERN_CYBER } from '../../utils/config';

const {
  MEMO,
  HDPATH,
  LEDGER_OK,
  LEDGER_NOAPP,
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
} = LEDGER;

const STAGE_CLI_INIT = 1.1;
const STAGE_CLI_VOTE = 1.2;
const STAGE_CLI_ADD_ADDRESS = 1.3;

class ActionBarDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
      ledger: null,
      address: null,
      returnCode: null,
      addressInfo: null,
      ledgerVersion: [0, 0, 0],
      time: 0,
      valueSelect: 'Yes',
      txMsg: null,
      txContext: null,
      txBody: null,
      txHeight: null,
      txHash: null,
      valueDeposit: '',
      errorMessage: null,
      valueAddress: '',
      cli: false,
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

  componentDidUpdate() {
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
      this.setState({
        ledger: null,
      });
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

  getNetworkId = async () => {
    const data = await statusNode();
    return data.node_info.network;
  };

  getAddressInfo = async () => {
    try {
      const { ledger, address } = this.state;

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

  generateTx = async () => {
    const {
      address,
      addressInfo,
      ledger,
      valueSelect,
      valueDeposit,
      cli,
      valueAddress,
    } = this.state;

    const { period, id } = this.props;

    let deposit = [];
    let tx;
    let txContext = null;
    let addressFrom = null;

    if (!cli) {
      addressFrom = address.bech32;
      txContext = {
        accountNumber: addressInfo.accountNumber,
        chainId: addressInfo.chainId,
        sequence: addressInfo.sequence,
        bech32: address.bech32,
        pk: address.pk,
        path: address.path,
      };
    } else {
      addressFrom = valueAddress;
    }

    if (valueDeposit > 0) {
      deposit = [
        {
          amount: `${valueDeposit * CYBER.DIVISOR_CYBER_G}`,
          denom: 'eul',
        },
      ];
    }

    switch (period) {
      case 'deposit': {
        tx = await ledger.txSendDeposit(
          txContext,
          id,
          addressFrom,
          deposit,
          MEMO,
          cli
        );
        break;
      }
      case 'vote': {
        tx = await ledger.txVoteProposal(
          txContext,
          id,
          addressFrom,
          valueSelect,
          MEMO,
          cli
        );
        break;
      }
      default: {
        tx = [];
      }
    }

    console.log('tx', tx);

    if (!cli) {
      await this.setState({
        txMsg: tx,
        txContext,
        txBody: null,
        error: null,
      });
      // debugger;
      this.signTx();
    } else {
      downloadObjectAsJson(tx, `tx_${period}`);
      this.setState({
        cli: false,
        stage: STAGE_INIT,
        valueDeposit: '',
      });
    }
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
    const { update } = this.props;
    if (this.state.txHash !== null) {
      this.setState({ stage: STAGE_CONFIRMING });
      const status = await this.state.ledger.txStatusCyber(this.state.txHash);
      const data = await status;
      if (data.logs) {
        this.setState({
          stage: STAGE_CONFIRMED,
          txHeight: data.height,
        });
        if (update) {
          update();
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

  onChangeSelect = async e => {
    const { value } = e.target;
    this.setState({
      valueSelect: value,
    });
  };

  onChangeInputDeposit = async e => {
    const { value } = e.target;
    this.setState({
      valueDeposit: value,
    });
  };

  cleatState = () => {
    this.setState({
      stage: STAGE_INIT,
      ledger: null,
      address: null,
      returnCode: null,
      addressInfo: null,
      ledgerVersion: [0, 0, 0],
      time: 0,
      valueSelect: 'Yes',
      txMsg: null,
      txContext: null,
      txBody: null,
      txHeight: null,
      txHash: null,
      valueDeposit: '',
      errorMessage: null,
      valueAddress: '',
      cli: false,
    });
    this.timeOut = null;
  };

  onClickInitStage = () => {
    this.cleatState();
    this.setState({
      stage: STAGE_INIT,
    });
  };

  onClickPutAddress = () => {
    // this.init();
    this.setState({
      stage: STAGE_READY,
    });
  };

  onClickSelect = () => {
    this.setState({
      stage: STAGE_SELECTION,
    });
  };

  onClickUsingCli = () => {
    this.setState({
      cli: true,
      stage: STAGE_CLI_ADD_ADDRESS,
    });
  };

  onClickUsingLedger = () => {
    this.setState({
      stage: STAGE_LEDGER_INIT,
    });
  };

  onChangeValueAddress = e => {
    const { value } = e.target;
    this.setState({
      valueAddress: value,
    });
  };

  render() {
    const {
      returnCode,
      ledgerVersion,
      stage,
      txMsg,
      txHeight,
      txHash,
      valueSelect,
      valueDeposit,
      errorMessage,
      valueAddress,
    } = this.state;
    const { period } = this.props;

    if (stage === STAGE_INIT && period.length === 0) {
      return (
        <ActionBar>
          <ActionBarContentText>
            <Dots />
          </ActionBarContentText>
        </ActionBar>
      );
    }

    if (stage === STAGE_INIT && period === 'deposit') {
      return (
        <ActionBar>
          <ActionBarContentText>
            <Pane marginRight={10}>send Deposit</Pane>
            <Input
              textAlign="end"
              value={valueDeposit}
              onChange={this.onChangeInputDeposit}
              marginRight={10}
              width={100}
              autoFocus
            />
            <Pane>{CYBER.DENOM_CYBER_G}</Pane>
          </ActionBarContentText>
          <Button
            disabled={!parseFloat(valueDeposit) > 0}
            onClick={this.onClickSelect}
          >
            Deposit
          </Button>
        </ActionBar>
      );
    }

    if (stage === STAGE_INIT && period === 'vote') {
      return (
        <ActionBar>
          <ActionBarContentText>
            <select
              style={{ height: 42, width: '200px' }}
              className="select-green"
              value={valueSelect}
              onChange={this.onChangeSelect}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Abstain">Abstain</option>
              <option value="NoWithVeto">NoWithVeto</option>
            </select>
          </ActionBarContentText>
          <Button onClick={this.onClickSelect}>Vote</Button>
        </ActionBar>
      );
    }

    if (stage === STAGE_SELECTION) {
      return (
        <ActionBar>
          <ActionBarContentText>
            <Button marginX={10} onClick={this.onClickUsingCli}>
              use Cli
            </Button>
            <Button marginX={10} onClick={this.onClickUsingLedger}>
              use Ledger
            </Button>
          </ActionBarContentText>
        </ActionBar>
      );
    }

    if (stage === STAGE_CLI_ADD_ADDRESS) {
      return (
        <ActionBar>
          <ActionBarContentText>
            <Pane marginRight={10}>Put your cyber address</Pane>
            <Input
              textAlign="end"
              value={valueAddress}
              onChange={this.onChangeValueAddress}
              marginRight={10}
              width={170}
              autoFocus
            />
          </ActionBarContentText>
          <Button
            disabled={!valueAddress.match(PATTERN_CYBER)}
            onClick={this.onClickPutAddress}
          >
            put
          </Button>
        </ActionBar>
      );
    }

    if (stage === STAGE_LEDGER_INIT) {
      return (
        <ConnectLadger
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

    if (stage === STAGE_READY) {
      if (period === 'deposit') {
        return (
          <ActionBar>
            <ActionBarContentText>
              I want to send deposit {`${valueDeposit} ${CYBER.DENOM_CYBER_G}`}
            </ActionBarContentText>
            <Button onClick={this.generateTx}>generateTx</Button>
          </ActionBar>
        );
      }
      if (period === 'vote') {
        return (
          <ActionBar>
            <ActionBarContentText>I vote {valueSelect}</ActionBarContentText>
            <Button onClick={this.generateTx}>generateTx</Button>
          </ActionBar>
        );
      }
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

export default ActionBarDetail;
