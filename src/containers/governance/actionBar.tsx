/* eslint-disable */
import { Component } from 'react';
import { coins } from '@cosmjs/launchpad';
import {
  TransactionSubmitted,
  Confirmed,
  GovernanceStartStageActionBar,
  CommunityPool,
  TextProposal,
  TransactionError,
  GovernanceChangeParam,
  GovernanceSoftwareUpgrade,
} from '../../components';

import { LEDGER, CYBER, DEFAULT_GAS_LIMITS } from '../../utils/config';
import { getTxs } from '../../utils/search/utils';
import { withIpfsAndKeplr } from '../Wallet/actionBarTweet';

const STAGE_TYPE_GOV = 9;

const {
  STAGE_INIT,
  STAGE_LEDGER_INIT,
  STAGE_SUBMITTED,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
  STAGE_ERROR,
} = LEDGER;

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
    this.transport = null;
  }

  generateTxKeplr = async () => {
    const {
      valueSelect,
      valueDescription,
      valueTitle,
      valueDeposit,
      valueAddressRecipient,
    } = this.state;
    const { signer, signingClient } = this.props;
    if (signer && signingClient) {
      const title = valueTitle;
      const description = valueDescription;
      const recipient = valueAddressRecipient;
      let response = {};
      const fee = {
        amount: [],
        gas: DEFAULT_GAS_LIMITS.toString(),
      };
      const [{ address }] = await signer.getAccounts();

      try {
        const deposit = coins(parseFloat(valueDeposit), CYBER.DENOM_CYBER);
        if (valueSelect === 'textProposal') {
          response = await signingClient.submitProposal(
            address,
            {
              typeUrl: '/cosmos.gov.v1beta1.TextProposal',
              value: {
                title,
                description,
              },
            },
            deposit,
            fee
          );
        }

        if (valueSelect === 'communityPool') {
          const amount = coins(10, CYBER.DENOM_CYBER);
          response = await signingClient.submitProposal(
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
      const data = await getTxs(this.state.txHash);
      if (data !== null) {
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

  onChangeInputDeposit = async (value) => {
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
    //TODO: create utils method for that
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

export default withIpfsAndKeplr(ActionBar);
