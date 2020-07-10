import React, { Component } from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { CosmosDelegateTool } from '../../utils/ledger';
import { Button } from '@cybercongress/gravity';
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
  CheckAddressInfo,
  GovernanceChangeParam,
  // GovernanceSoftwareUpgrade,
} from '../../components';
import { getAccountBandwidth, statusNode } from '../../utils/search/utils';

import { LEDGER, CYBER } from '../../utils/config';

const STAGE_TYPE_GOV = 9;

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
  LEDGER_VERSION_REQ,
} = LEDGER;

const LEDGER_TX_ACOUNT_INFO = 10;

class ActionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
      address: null,
      addressInfo: null,
      valueSelect: 'textProposal',
      txMsg: null,
      txContext: null,
      txBody: null,
      txHeight: null,
      txHash: null,
      valueDescription: '',
      valueTitle: '',
      valueDeposit: '',
      valueAmountRecipient: '',
      valueAddressRecipient: '',
      errorMessage: null,
      connectLedger: null,
      valueSelectChangeParam: '',
      selectedParam: {},
      changeParam: [],
      nameUpgrade: '',
      heightUpgrade: '',
    };
    this.timeOut = null;
    this.ledger = null;
    this.transport = null;
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
    const responseStatusNode = await statusNode();
    if (responseStatusNode !== null) {
      return responseStatusNode.node_info.network;
    }
    return '';
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
        stage: STAGE_TYPE_GOV,
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

  generateTx = async () => {
    const {
      address,
      addressInfo,
      valueSelect,
      valueDescription,
      valueTitle,
      valueDeposit,
      valueAmountRecipient,
      valueAddressRecipient,
      changeParam,
      nameUpgrade,
      heightUpgrade,
    } = this.state;

    let deposit = [];
    let title = '';
    let description = '';
    const recipient = valueAddressRecipient;
    let amount = [];

    let tx;

    const txContext = {
      accountNumber: addressInfo.accountNumber,
      chainId: addressInfo.chainId,
      sequence: addressInfo.sequence,
      bech32: address.bech32,
      pk: address.pk,
      path: address.path,
    };

    if (valueDeposit > 0) {
      deposit = [
        {
          amount: `${valueDeposit * CYBER.DIVISOR_CYBER_G}`,
          denom: 'eul',
        },
      ];
    }

    if (valueAmountRecipient > 0) {
      amount = [
        {
          amount: `${valueAmountRecipient * CYBER.DIVISOR_CYBER_G}`,
          denom: 'eul',
        },
      ];
    }

    description = valueDescription;
    title = valueTitle;

    switch (valueSelect) {
      case 'textProposal': {
        tx = await this.ledger.textProposal(
          txContext,
          address.bech32,
          title,
          description,
          deposit,
          MEMO
        );
        break;
      }
      case 'communityPool': {
        tx = await this.ledger.communityPool(
          txContext,
          address.bech32,
          title,
          description,
          recipient,
          deposit,
          amount,
          MEMO
        );
        break;
      }
      case 'paramChange': {
        tx = await this.ledger.paramChange(
          txContext,
          address.bech32,
          title,
          description,
          changeParam,
          deposit,
          MEMO
        );
        break;
      }

      case 'softwareUpgrade': {
        tx = await this.ledger.softwareUpgrade(
          txContext,
          address.bech32,
          title,
          description,
          nameUpgrade,
          heightUpgrade,
          deposit,
          MEMO
        );
        break;
      }
      default: {
        tx = [];
      }
    }

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

  onClickSelect = async () => {
    await this.setState({
      stage: STAGE_LEDGER_INIT,
    });
    this.getLedgerAddress();
  };

  onChangeSelect = async e => {
    const { value } = e.target;
    this.setState({
      valueSelect: value,
    });
  };

  onChangeInputTitle = async e => {
    const { value } = e.target;
    this.setState({
      valueTitle: value,
    });
  };

  onChangeInputDescription = async e => {
    const { value } = e.target;
    this.setState({
      valueDescription: value,
    });
  };

  onChangeInputDeposit = async e => {
    const { value } = e.target;
    this.setState({
      valueDeposit: value,
    });
  };

  onChangeInputAddressRecipient = async e => {
    const { value } = e.target;
    this.setState({
      valueAddressRecipient: value,
    });
  };

  onChangeInputAmountRecipient = async e => {
    const { value } = e.target;
    this.setState({
      valueAmountRecipient: value,
    });
  };

  cleatState = () => {
    this.setState({
      stage: STAGE_INIT,
      address: null,
      addressInfo: null,
      valueSelect: 'textProposal',
      txMsg: null,
      txContext: null,
      txBody: null,
      txHeight: null,
      txHash: null,
      valueDescription: '',
      valueTitle: '',
      valueDeposit: '',
      valueAmountRecipient: '',
      valueAddressRecipient: '',
      errorMessage: null,
      valueSelectChangeParam: '',
      selectedParam: {},
      changeParam: [],
      nameUpgrade: '',
      heightUpgrade: '',
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

  onClickUsingLedger = () => {
    // this.init();
    this.setState({
      stage: STAGE_LEDGER_INIT,
    });
  };

  onFilePickerChange = files => {
    const reader = new FileReader();

    reader.readAsText(files[0], 'UTF-8');
    reader.onload = evt => {
      console.log(evt.target.result);

      const loadedJson = JSON.parse(evt.target.result);
      console.log('loadedJson', loadedJson);
    };

    reader.onerror = evt => {
      console.log('error', evt);
    };
  };

  onChangeSelectParam = e => {
    const { value } = e.target;
    this.setState({
      valueSelectChangeParam: value,
      selectedParam: JSON.parse(value),
      valueParam: '',
    });
  };

  onChangeInputParam = e => {
    const { selectedParam } = this.state;
    const { value } = e.target;

    this.setState({
      valueParam: value,
      selectedParam: { ...selectedParam, value: `\\"${value}\\"` },
    });
  };

  onClickBtnAddParam = () => {
    const { selectedParam, changeParam } = this.state;

    this.setState({
      changeParam: [...changeParam, selectedParam],
      valueParam: '',
      valueSelectChangeParam: '',
    });
  };

  onClickDeleteParam = index => {
    const { changeParam } = this.state;
    const tempArr = changeParam;

    tempArr.splice(index, 1);

    this.setState({
      changeParam: tempArr,
    });
  };

  render() {
    const {
      address,
      stage,
      txMsg,
      txHeight,
      txHash,
      valueSelect,
      valueDescription,
      valueTitle,
      valueDeposit,
      valueAmountRecipient,
      valueAddressRecipient,
      errorMessage,
      connectLedger,
      valueSelectChangeParam,
      valueParam,
      changeParam,
      nameUpgrade,
      heightUpgrade,
    } = this.state;

    if (stage === STAGE_INIT) {
      return (
        <GovernanceStartStageActionBar
          onClickBtn={this.onClickSelect}
          valueSelect={valueSelect}
          onChangeSelect={this.onChangeSelect}
        />
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

    if (valueSelect === 'textProposal' && stage === STAGE_TYPE_GOV) {
      return (
        <TextProposal
          addrProposer={address.bech32}
          onClickBtn={this.generateTx}
          onChangeInputTitle={this.onChangeInputTitle}
          onChangeInputDescription={this.onChangeInputDescription}
          onChangeInputDeposit={this.onChangeInputDeposit}
          valueDescription={valueDescription}
          valueTitle={valueTitle}
          valueDeposit={valueDeposit}
          onClickBtnCloce={this.onClickInitStage}
        />
      );
    }

    if (valueSelect === 'communityPool' && stage === STAGE_TYPE_GOV) {
      return (
        <CommunityPool
          addrProposer={address.bech32}
          onClickBtn={this.generateTx}
          onChangeInputTitle={this.onChangeInputTitle}
          onChangeInputDescription={this.onChangeInputDescription}
          onChangeInputDeposit={this.onChangeInputDeposit}
          valueDescription={valueDescription}
          valueTitle={valueTitle}
          valueDeposit={valueDeposit}
          onClickBtnCloce={this.onClickInitStage}
          valueAddressRecipient={valueAddressRecipient}
          onChangeInputAddressRecipient={this.onChangeInputAddressRecipient}
          valueAmountRecipient={valueAmountRecipient}
          onChangeInputAmountRecipient={this.onChangeInputAmountRecipient}
        />
      );
    }

    if (valueSelect === 'paramChange' && stage === STAGE_TYPE_GOV) {
      return (
        <GovernanceChangeParam
          valueSelect={valueSelectChangeParam}
          onChangeSelect={this.onChangeSelectParam}
          onClickBtnAddParam={this.onClickBtnAddParam}
          onChangeInputParam={e => this.onChangeInputParam(e)}
          valueParam={valueParam}
          changeParam={changeParam}
          onClickDeleteParam={this.onClickDeleteParam}
          onChangeInputTitle={this.onChangeInputTitle}
          onChangeInputDescription={this.onChangeInputDescription}
          onChangeInputDeposit={this.onChangeInputDeposit}
          valueDescription={valueDescription}
          valueTitle={valueTitle}
          valueDeposit={valueDeposit}
          onClickBtnCloce={this.onClickInitStage}
          onClickBtn={this.generateTx}
        />
      );
    }

    // if (valueSelect === 'softwareUpgrade' && stage === STAGE_TYPE_GOV) {
    //   return (
    //     <GovernanceSoftwareUpgrade
    //       onChangeInputTitle={this.onChangeInputTitle}
    //       onChangeInputDescription={this.onChangeInputDescription}
    //       onChangeInputDeposit={this.onChangeInputDeposit}
    //       valueDescription={valueDescription}
    //       valueTitle={valueTitle}
    //       valueDeposit={valueDeposit}
    //       onClickBtnCloce={this.onClickInitStage}
    //       onClickBtn={this.generateTx}
    //     />
    //   );
    // }

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

export default ActionBar;
