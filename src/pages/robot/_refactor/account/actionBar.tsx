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
  ActionBar as ActionBarComp,
} from '../../../../components';
import {
  LEDGER,
  CYBER,
  PATTERN_IPFS_HASH,
  DEFAULT_GAS_LIMITS,
} from '../../../../utils/config';

import { getTotalRewards, getTxs } from '../../../../utils/search/utils';

import Button from 'src/components/btnGrd';
import withIpfsAndKeplr from '../../../../hocs/withIpfsAndKeplr';
import { CID_FOLLOW, CID_TWEET } from 'src/constants/app';
import { routes } from 'src/routes';
import { createSearchParams } from 'react-router-dom';
import { AccountValue } from 'src/types/defaultAccount';

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

type Props = {
  defaultAccount: AccountValue;

  type: string;

  addressSend: string;

  // can be followed
  follow: boolean;
  tweets: boolean;

  updateAddress: () => void;

  // add more
};

class ActionBarContainer extends Component<Props> {
  constructor(props: Props) {
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
    const { ipfsApi } = this.props;

    let toCid = contentHash;

    if (file !== null) {
      toCid = await ipfsApi.addContent(file);
    } else if (!contentHash.match(PATTERN_IPFS_HASH)) {
      toCid = await ipfsApi.addContent(contentHash);
    }

    return toCid;
  };

  generateTxSendKplr = async () => {
    const { contentHash, toSendAddres, toSend } = this.state;
    const {
      type,
      addressSend,
      follow,
      tweets,
      signer,
      signingClient,
      ipfsApi,
    } = this.props;
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
      } else if ((type === 'log' || !type) && follow) {
        const toCid = await ipfsApi.addContent(addressSend);
        response = await signingClient.cyberlink(
          address,
          CID_FOLLOW,
          toCid,
          fee
        );
      } else if (type === 'log' && tweets) {
        const toCid = await this.calculationIpfsTo(contentHash);
        response = await signingClient.cyberlink(
          address,
          CID_TWEET,
          toCid,
          fee
        );
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

  clearState = () => {
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

    const isOwner = defaultAccount && defaultAccount.bech32 === addressSend;

    if (stage === STAGE_INIT) {
      const followBtn = <Button onClick={this.onClickSend}>Follow</Button>;

      const content = [];

      // main page
      if (!type) {
        if (!isOwner) {
          content.push(
            <Button
              link={
                routes.teleport.send.path +
                '?' +
                createSearchParams({
                  recipient: addressSend,
                  token: 'boot',
                  amount: '1',
                }).toString()
              }
            >
              Send
            </Button>
          );
        }

        if (follow) {
          content.push(followBtn);
        }
      }

      if (type === 'log') {
        if (follow) {
          content.push(followBtn);
        }

        if (tweets) {
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
      }

      if (type === 'security' && isOwner && defaultAccount.keys === 'keplr') {
        content.push(<Button onClick={this.onClickSend}>Claim rewards</Button>);
      }

      return <ActionBarComp>{content}</ActionBarComp>;
    }

    if (stage === STAGE_READY) {
      if (type === 'security') {
        return (
          <RewardsDelegators
            data={rewards}
            onClickBtnClose={this.clearState}
            onClickBtn={this.generateTx}
          />
        );
      }
      if (type === 'mentions') {
        return (
          <Cyberlink
            onClickBtnClose={this.clearState}
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
        <JsonTransaction txMsg={txMsg} onClickBtnClose={this.clearState} />
      );
    }

    if (stage === STAGE_SUBMITTED || stage === STAGE_CONFIRMING) {
      return <TransactionSubmitted onClickBtnClose={this.clearState} />;
    }

    if (stage === STAGE_CONFIRMED) {
      return (
        <Confirmed
          txHash={txHash}
          txHeight={txHeight}
          onClickBtn={this.clearState}
          onClickBtnClose={this.clearState}
        />
      );
    }

    if (stage === STAGE_ERROR && errorMessage !== null) {
      return (
        <TransactionError
          errorMessage={errorMessage}
          onClickBtn={this.clearState}
          onClickBtnClose={this.clearState}
        />
      );
    }

    return null;
  }
}

export default withIpfsAndKeplr(ActionBarContainer);
