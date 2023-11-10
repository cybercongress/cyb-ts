/* eslint-disable */
import React, { Component } from 'react';
import { Pane, ActionBar } from '@cybercongress/gravity';
import { connect } from 'react-redux';
import { coins } from '@cosmjs/launchpad';
import {
  JsonTransaction,
  TransactionSubmitted,
  Confirmed,
  RewardsDelegators,
  Cyberlink,
  StartStageSearchActionBar,
  TransactionError,
  Dots,
  ActionBarContentText,
} from '../../../../components';
import {
  LEDGER,
  CYBER,
  PATTERN_IPFS_HASH,
  DEFAULT_GAS_LIMITS,
} from '../../../../utils/config';

import { getTotalRewards, getTxs } from '../../../../utils/search/utils';

import { addContenToIpfs } from 'src/utils/ipfs/utils-ipfs';
import Button from 'src/components/btnGrd';
import withIpfsAndKeplr from '../../../../hocs/withIpfsAndKeplr';

const { DIVISOR_CYBER_G } = CYBER;

const {
  STAGE_INIT,
  STAGE_READY,
  STAGE_WAIT,
  STAGE_SUBMITTED,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
  STAGE_ERROR,
} = LEDGER;

class ActionBarContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
      address: null,
      file: null,
      toSend: '',
      toSendAddres: '',
      contentHash: '',
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
    this.timeOut = null;
    this.inputOpenFileRef = React.createRef();
  }

  calculationIpfsTo = async (contentHash) => {
    const { file } = this.state;
    const { node } = this.props;

    let toCid = contentHash;
    if (file !== null) {
      toCid = file;
    }

    if (file !== null) {
      toCid = await addContenToIpfs(node, toCid);
    } else if (!toCid.match(PATTERN_IPFS_HASH)) {
      toCid = await addContenToIpfs(node, toCid);
    }

    return toCid;
  };

  generateTxSendKplr = async () => {
    const { contentHash, toSendAddres, toSend } = this.state;
    const { type, addressSend, follow, tweets, signer, signingClient, node } =
      this.props;
    const amount = parseFloat(toSend) * DIVISOR_CYBER_G;
    const fee = {
      amount: [],
      gas: DEFAULT_GAS_LIMITS.toString(),
    };

    if (signer && signingClient) {
      const [{ address }] = await signer.getAccounts();
      let response = null;
      const msg = [];
      if (type === 'security') {
        if (address === addressSend) {
          const dataTotalRewards = await getTotalRewards(address);
          console.log(`dataTotalRewards`, dataTotalRewards);
          if (dataTotalRewards !== null && dataTotalRewards.rewards) {
            const { rewards } = dataTotalRewards;
            const validatorAddress = [];
            Object.keys(rewards).forEach((key) => {
              if (rewards[key].reward !== null) {
                validatorAddress.push(rewards[key].validator_address);
              }
            });
            const gasLimitsRewards =
              100000 * Object.keys(validatorAddress).length;
            const feeRewards = {
              amount: [],
              gas: gasLimitsRewards.toString(),
            };
            response = await signingClient.withdrawAllRewards(
              address,
              validatorAddress,
              feeRewards
            );
          }
        }
      } else if (type === 'log' && follow) {
        const fromCid = await addContenToIpfs(node, 'follow');
        const toCid = await addContenToIpfs(node, addressSend);
        response = await signingClient.cyberlink(address, fromCid, toCid, fee);
      } else if (type === 'log' && tweets) {
        const fromCid = await addContenToIpfs(node, 'tweet');
        const toCid = await this.calculationIpfsTo(contentHash);
        response = await signingClient.cyberlink(address, fromCid, toCid, fee);
      } else {
        msg.push({
          type: 'cosmos-sdk/MsgSend',
          value: {
            amount: coins(amount, CYBER.DENOM_CYBER),
            from_address: address,
            to_address: toSendAddres,
          },
        });
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
    }
  };

  confirmTx = async () => {
    const { updateAddress } = this.props;
    const { txHash } = this.state;
    if (txHash !== null) {
      this.setState({ stage: STAGE_CONFIRMING });
      const data = await getTxs(txHash);
      if (data !== null) {
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
    }
    this.timeOut = setTimeout(this.confirmTx, 1500);
  };

  onChangeInputAmount = (e) => {
    this.setState({
      toSend: e.target.value,
    });
  };

  onChangeInputInputAddressT = (e) => {
    this.setState({
      toSendAddres: e.target.value,
    });
  };

  onClickSend = () => {
    const { defaultAccount } = this.props;
    if (defaultAccount.keys === 'keplr') {
      this.generateTxSendKplr();
    }
  };

  cleatState = () => {
    this.setState({
      stage: STAGE_INIT,
      address: null,
      toSend: '',
      toSendAddres: '',
      txMsg: null,
      txHash: null,
      txHeight: null,
      contentHash: '',
    });
    this.timeOut = null;
  };

  onChangeInput = async (e) => {
    const { value } = e.target;
    this.setState({
      contentHash: value,
    });
  };

  showOpenFileDlg = () => {
    this.inputOpenFileRef.current.click();
  };

  onFilePickerChange = (files) => {
    const file = files.current.files[0];

    this.setState({
      file,
    });
  };

  onClickClear = () => {
    this.setState({
      file: null,
    });
  };

  render() {
    const { type, addressSend, tweets, follow, defaultAccount } = this.props;
    const {
      stage,
      address,
      txMsg,
      txHash,
      txHeight,
      rewards,
      bandwidth,
      contentHash,
      errorMessage,
      file,
    } = this.state;

    if (stage === STAGE_INIT && type === 'log' && follow) {
      return (
        <ActionBar>
          <Pane>
            <Button onClick={(e) => this.onClickSend(e)}>Follow</Button>
          </Pane>
        </ActionBar>
      );
    }

    if (stage === STAGE_INIT && type === 'log' && tweets) {
      return (
        <StartStageSearchActionBar
          onClickBtn={this.onClickSend}
          contentHash={
            file !== null && file !== undefined ? file.name : contentHash
          }
          onChangeInputContentHash={this.onChangeInput}
          textBtn="Tweet"
          placeholder="What's happening?"
          inputOpenFileRef={this.inputOpenFileRef}
          showOpenFileDlg={this.showOpenFileDlg}
          onChangeInput={this.onFilePickerChange}
          onClickClear={this.onClickClear}
          file={file}
          keys={defaultAccount !== null ? defaultAccount.keys : false}
        />
      );
    }

    if (
      stage === STAGE_INIT &&
      type === 'security' &&
      defaultAccount !== null &&
      defaultAccount.keys === 'keplr' &&
      addressSend === defaultAccount.bech32
    ) {
      return (
        <ActionBar>
          <Pane>
            <Button
              disabled={addressSend !== defaultAccount.bech32}
              onClick={(e) => this.onClickSend(e)}
            >
              Claim rewards
            </Button>
          </Pane>
        </ActionBar>
      );
    }

    if (stage === STAGE_READY) {
      if (type === 'security') {
        return (
          <RewardsDelegators
            data={rewards}
            onClickBtnCloce={this.cleatState}
            onClickBtn={this.generateTx}
          />
        );
      }
      if (type === 'mentions') {
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
      if (type === 'log') {
        return (
          <ActionBar>
            <ActionBarContentText>
              transaction generation <Dots big />
            </ActionBarContentText>
          </ActionBar>
        );
      }
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

export default withIpfsAndKeplr(ActionBarContainer);
