import React, { Component } from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { ActionBar, Input, Button, Pane } from '@cybercongress/gravity';
import { CosmosDelegateTool } from '../../utils/ledger';
import {
  ConnectLadger,
  JsonTransaction,
  TransactionSubmitted,
  Confirmed,
  TransactionError,
  ActionBarContentText,
  Dots,
  CheckAddressInfo,
} from '../../components';

import { downloadObjectAsJson } from '../../utils/utils';

import { statusNode } from '../../utils/search/utils';

import { LEDGER, CYBER, PATTERN_CYBER } from '../../utils/config';

const {
  MEMO,
  HDPATH,
  LEDGER_OK,
  STAGE_INIT,
  STAGE_SELECTION,
  STAGE_LEDGER_INIT,
  STAGE_READY,
  STAGE_WAIT,
  STAGE_SUBMITTED,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
  STAGE_ERROR,
} = LEDGER;
const LEDGER_TX_ACOUNT_INFO = 10;

const STAGE_CLI_ADD_ADDRESS = 1.3;

class ActionBarDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
      address: null,
      addressInfo: null,
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
      connectLedger: null,
    };
    this.timeOut = null;
    this.ledger = null;
    this.transport = null;
  }

  componentDidMount() {
    this.ledger = new CosmosDelegateTool(this.transport);
  }

  getLedgerAddress = async () => {
    this.transport = await TransportWebUSB.create(120 * 1000);
    this.ledger = new CosmosDelegateTool(this.transport);

    const connect = await this.ledger.connect();
    if (connect.return_code === LEDGER_OK) {
      this.setState({
        connectLedger: true,
      });

      const address = await this.ledger.retrieveAddressCyber(HDPATH);
      console.log('address', address);
      this.setState({
        address,
      });
      this.getAddressInfo();
    } else {
      this.setState({
        connectLedger: false,
      });
    }
  };

  getNetworkId = async () => {
    const data = await statusNode();
    return data.node_info.network;
  };

  getAddressInfo = async () => {
    try {
      const { address } = this.state;
      this.setState({
        stage: LEDGER_TX_ACOUNT_INFO,
      });

      const addressInfo = await this.ledger.getAccountInfoCyber(address);
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
console.log('period :>> ', period);
    switch (period) {
      case 'deposit': {
        tx = await this.ledger.txSendDeposit(
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
        tx = await this.ledger.txVoteProposal(
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
    const { update } = this.props;
    if (this.state.txHash !== null) {
      this.setState({ stage: STAGE_CONFIRMING });
      const status = await this.ledger.txStatusCyber(this.state.txHash);
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
      address: null,
      addressInfo: null,
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
    this.ledger = null;
    this.transport = null;
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
    this.getLedgerAddress();
  };

  onChangeValueAddress = e => {
    const { value } = e.target;
    this.setState({
      valueAddress: value,
    });
  };

  render() {
    const {
      stage,
      txMsg,
      txHeight,
      txHash,
      valueSelect,
      valueDeposit,
      errorMessage,
      valueAddress,
      connectLedger,
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
          onClickConnect={() => this.getLedgerAddress()}
          connectLedger={connectLedger}
        />
      );
    }

    if (stage === LEDGER_TX_ACOUNT_INFO) {
      return <CheckAddressInfo />;
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
