import React, { Component } from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { Button } from '@cybercongress/gravity';
import { toAscii, fromBase64, toBase64 } from '@cosmjs/encoding';
import {
  SigningCosmosClient,
  GasPrice,
  coins,
  makeSignDoc,
  makeStdTx,
} from '@cosmjs/launchpad';
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
  CheckAddressInfo,
  GovernanceChangeParam,
  GovernanceSoftwareUpgrade,
} from '../../components';
import { getAccountBandwidth, statusNode } from '../../utils/search/utils';
import { AppContext } from '../../context';

import { LEDGER, CYBER, DEFAULT_GAS_LIMITS } from '../../utils/config';

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
      valueSelect: 'textProposal',
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
    };
    this.timeOut = null;
    this.ledger = null;
    this.transport = null;
  }

  componentDidMount() {
    this.ledger = new CosmosDelegateTool();
  }

  generateTxKeplr = async () => {
    const {
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
    const { keplr } = this.context;
    console.log('keplr', keplr);
    if (keplr !== null) {
      // let deposit = [];
      const title = valueTitle;
      const description = valueDescription;
      const recipient = valueAddressRecipient;
      let msgs = [];
      let response = {};
      const fee = {
        amount: [],
        gas: DEFAULT_GAS_LIMITS.toString(),
      };
      const [{ address }] = await keplr.signer.getAccounts();

      // if (valueDeposit > 0) {
      //   deposit = coins(valueDeposit, CYBER.DENOM_CYBER);
      // }

      // if (valueAmountRecipient > 0) {
      //   amount = coins(valueAmountRecipient, CYBER.DENOM_CYBER);
      // }

      try {
        const deposit = coins(parseFloat(valueDeposit), CYBER.DENOM_CYBER);
        if (valueSelect === 'textProposal') {
          response = await keplr.submitProposal(
            address,
            {
              typeUrl: '/cosmos.gov.v1beta1.TextProposal',
              value: {
                Title: title,
                Description: description,
              },
            },
            deposit,
            fee
          );
        }

        if (valueSelect === 'communityPool') {
          const amount = coins(10, CYBER.DENOM_CYBER);
          response = await keplr.submitProposal(
            address,
            {
              typeUrl:
                '/cosmos.distribution.v1beta1.CommunityPoolSpendProposal',
              value: {
                amount,
                description,
                recipient,
                title,
              },
            },
            deposit,
            fee
          );
        }
        console.log(`response`, response);

        if (response.code === 0) {
          const hash = response.transactionHash;
          console.log('hash :>> ', hash);
          this.setState({ stage: STAGE_SUBMITTED, txHash: hash });
          this.timeOut = setTimeout(this.confirmTx, 1500);
        } else {
          this.setState({
            txHash: null,
            stage: STAGE_ERROR,
            errorMessage: response.rawLog.toString(),
          });
        }
      } catch (error) {
        console.log(`error`, error);
      }
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
      stage: STAGE_TYPE_GOV,
    });
  };

  generateTxInit = async () => {
    const { account } = this.props;
    console.log('account', account);
    if (account !== null) {
      if (account.keys === 'keplr') {
        this.generateTxKeplr();
      }
    }
  };

  onChangeSelect = async (e) => {
    const { value } = e.target;
    this.setState({
      valueSelect: value,
    });
  };

  onChangeInputTitle = async (e) => {
    const { value } = e.target;
    this.setState({
      valueTitle: value,
    });
  };

  onChangeInputDescription = async (e) => {
    const { value } = e.target;
    this.setState({
      valueDescription: value,
    });
  };

  onChangeInputDeposit = async (e) => {
    const { value } = e.target;
    this.setState({
      valueDeposit: value,
    });
  };

  onChangeInputAddressRecipient = async (e) => {
    const { value } = e.target;
    this.setState({
      valueAddressRecipient: value,
    });
  };

  onChangeInputAmountRecipient = async (e) => {
    const { value } = e.target;
    this.setState({
      valueAmountRecipient: value,
    });
  };

  cleatState = () => {
    this.setState({
      stage: STAGE_INIT,
      valueSelect: 'textProposal',
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

  onFilePickerChange = (files) => {
    const reader = new FileReader();

    reader.readAsText(files[0], 'UTF-8');
    reader.onload = (evt) => {
      console.log(evt.target.result);

      const loadedJson = JSON.parse(evt.target.result);
      console.log('loadedJson', loadedJson);
    };

    reader.onerror = (evt) => {
      console.log('error', evt);
    };
  };

  onChangeSelectParam = (e) => {
    const { value } = e.target;
    this.setState({
      valueSelectChangeParam: value,
      selectedParam: JSON.parse(value),
      valueParam: '',
    });
  };

  onChangeInputParam = (e) => {
    const { selectedParam } = this.state;
    const { value } = e.target;

    this.setState({
      valueParam: value,
      selectedParam: { ...selectedParam, value: `${value}` },
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

  onClickDeleteParam = (index) => {
    const { changeParam } = this.state;
    const tempArr = changeParam;

    tempArr.splice(index, 1);

    this.setState({
      changeParam: tempArr,
    });
  };

  onChangeInputValueNameUpgrade = (e) => {
    const { value } = e.target;

    this.setState({
      nameUpgrade: value,
    });
  };

  onChangeInputValueHeightUpgrade = (e) => {
    const { value } = e.target;

    this.setState({
      heightUpgrade: value,
    });
  };

  render() {
    const {
      stage,
      txHeight,
      txHash,
      valueSelect,
      valueDescription,
      valueTitle,
      valueDeposit,
      valueAmountRecipient,
      valueAddressRecipient,
      errorMessage,
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

    if (valueSelect === 'textProposal' && stage === STAGE_TYPE_GOV) {
      return (
        <TextProposal
          // addrProposer={address.bech32}
          onClickBtn={this.generateTxInit}
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
          // addrProposer={address.bech32}
          onClickBtn={this.generateTxInit}
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
          onChangeInputParam={(e) => this.onChangeInputParam(e)}
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
          onClickBtn={this.generateTxInit}
        />
      );
    }

    if (valueSelect === 'softwareUpgrade' && stage === STAGE_TYPE_GOV) {
      return (
        <GovernanceSoftwareUpgrade
          onChangeInputTitle={this.onChangeInputTitle}
          onChangeInputDescription={this.onChangeInputDescription}
          onChangeInputDeposit={this.onChangeInputDeposit}
          valueDescription={valueDescription}
          valueTitle={valueTitle}
          valueDeposit={valueDeposit}
          onClickBtnCloce={this.onClickInitStage}
          onClickBtn={this.generateTxInit}
          valueNameUpgrade={nameUpgrade}
          valueHeightUpgrade={heightUpgrade}
          onChangeInputValueNameUpgrade={(e) =>
            this.onChangeInputValueNameUpgrade(e)
          }
          onChangeInputValueHeightUpgrade={(e) =>
            this.onChangeInputValueHeightUpgrade(e)
          }
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

ActionBar.contextType = AppContext;

export default ActionBar;
