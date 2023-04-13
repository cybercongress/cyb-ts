/* eslint-disable */
import React, { Component, useContext } from 'react';
import { Pane, ActionBar, Button } from '@cybercongress/gravity';
import { connect } from 'react-redux';
import {
  ConnectLadger,
  JsonTransaction,
  TransactionSubmitted,
  Confirmed,
  StartStageSearchActionBar,
  TransactionError,
  ActionBarContentText,
  CheckAddressInfo,
  Dots,
} from '../../components';

import { getPin, getTxs } from '../../utils/search/utils';
import { trimString } from '../../utils/utils';

import { AppContext } from '../../context';

import {
  LEDGER,
  CYBER,
  PATTERN_IPFS_HASH,
  POCKET,
  DEFAULT_GAS_LIMITS,
} from '../../utils/config';
import useIpfs from 'src/hooks/useIpfs';
import useSigningClient from 'src/hooks/useSigningClient';

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

const CREATE_LINK = 10;
const ADD_ADDRESS = 11;
const LEDGER_TX_ACOUNT_INFO = 12;
const STAGE_IPFS_HASH = 3.1;
const STAGE_KEPLR_APPROVE = 3.2;

class ActionBarTweet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
      init: false,
      address: null,
      returnCode: null,
      addressInfo: null,
      ledgerVersion: [0, 0, 0],
      time: 0,
      bandwidth: {
        remained: 0,
        max_value: 0,
      },
      linkPrice: 0,
      contentHash: '',
      addressLocalStor: null,
      txMsg: null,
      txContext: null,
      txBody: null,
      txHeight: null,
      txHash: null,
      error: null,
      errorMessage: null,
      file: null,
      connectLedger: null,
      fromCid: null,
      toCid: null,
      textBtn: '',
      placeholder: '',
    };
    this.timeOut = null;

    this.inputOpenFileRef = React.createRef();
  }

  async componentDidMount() {
    await this.checkAddressLocalStorage();
    this.getNameBtn();
    console.warn('Looking for Ledger Nano');
  }

  componentDidUpdate(prevProps) {
    const { stage, address, addressInfo, fromCid, toCid } = this.state;
    const { refresh, defaultAccount } = this.props;

    if (prevProps.refresh !== refresh) {
      this.getNameBtn();
    }
    if (
      stage === STAGE_IPFS_HASH &&
      fromCid &&
      toCid &&
      toCid !== null &&
      fromCid !== null
    ) {
      this.generateTxKeplr();
    }
    if (prevProps.defaultAccount.name !== defaultAccount.name) {
      this.checkAddressLocalStorage();
    }
  }

  checkAddressLocalStorage = async () => {
    const { defaultAccount } = this.props;
    const { account } = defaultAccount;
    if (
      account !== null &&
      Object.prototype.hasOwnProperty.call(account, 'cyber')
    ) {
      const { keys, bech32 } = account.cyber;
      if (keys !== 'read-only') {
        this.setState({
          addressLocalStor: { address: bech32, keys },
        });
      } else {
        this.setState({
          addressLocalStor: null,
        });
      }
    } else {
      this.setState({
        addressLocalStor: null,
      });
    }
  };

  getNameBtn = () => {
    const { stageTweetActionBar } = this.props;

    if (stageTweetActionBar === POCKET.STAGE_TWEET_ACTION_BAR.TWEET) {
      this.setState({
        textBtn: 'Tweet',
        placeholder: "What's happening?",
      });
    } else {
      this.setState({
        textBtn: 'add Avatar',
        placeholder: 'Select an avatar',
      });
    }
  };

  calculationIpfsTo = async () => {
    const { contentHash, file } = this.state;
    const { node, stageTweetActionBar } = this.props;

    let toCid = contentHash;

    if (stageTweetActionBar === POCKET.STAGE_TWEET_ACTION_BAR.FOLLOW) {
      toCid = CYBER.CYBER_CONGRESS_ADDRESS;
    }

    if (file !== null) {
      toCid = file;
    }

    if (file !== null) {
      toCid = await getPin(node, toCid);
    } else if (!toCid.match(PATTERN_IPFS_HASH)) {
      toCid = await getPin(node, toCid);
    }

    this.setState({
      toCid,
    });
  };

  calculationIpfsFrom = async () => {
    const { stageTweetActionBar, node } = this.props;
    let type = '';

    if (stageTweetActionBar === POCKET.STAGE_TWEET_ACTION_BAR.ADD_AVATAR) {
      type = 'avatar';
    }

    if (stageTweetActionBar === POCKET.STAGE_TWEET_ACTION_BAR.FOLLOW) {
      type = POCKET.STAGE_TWEET_ACTION_BAR.FOLLOW;
    }

    if (stageTweetActionBar === POCKET.STAGE_TWEET_ACTION_BAR.TWEET) {
      type = POCKET.STAGE_TWEET_ACTION_BAR.TWEET;
    }

    const fromCid = await getPin(node, type);

    this.setState({
      fromCid,
    });
  };

  stageReady = () => {
    this.link();
  };

  generateTxKeplr = async () => {
    const { signer, signingClient } = this.props;
    const { fromCid, toCid, addressLocalStor } = this.state;

    console.log('fromCid, toCid :>> ', fromCid, toCid);

    this.setState({
      stage: STAGE_KEPLR_APPROVE,
    });
    if (signer && signingClient) {
      const { address } = (await signer.getAccounts())[0];
      const fee = {
        amount: [],
        gas: DEFAULT_GAS_LIMITS.toString(),
      };
      if (addressLocalStor !== null && addressLocalStor.address === address) {
        const result = await signingClient.cyberlink(
          address,
          fromCid,
          toCid,
          fee
        );
        if (result.code === 0) {
          const hash = result.transactionHash;
          console.log('hash :>> ', hash);
          this.setState({ stage: STAGE_SUBMITTED, txHash: hash });
          this.timeOut = setTimeout(this.confirmTx, 1500);
        } else {
          this.setState({
            txHash: null,
            stage: STAGE_ERROR,
            errorMessage: result.rawLog.toString(),
          });
        }
        console.log('result: ', result);
      } else {
        this.setState({
          stage: STAGE_ERROR,
          errorMessage: `Add address ${trimString(
            address,
            9,
            5
          )} to your pocket or make active `,
        });
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

  onChangeInput = async (e) => {
    const { value } = e.target;
    this.setState({
      contentHash: value,
    });
  };

  cleatState = () => {
    this.setState({
      stage: STAGE_INIT,
      init: false,
      address: null,
      returnCode: null,
      addressInfo: null,
      ledgerVersion: [0, 0, 0],
      time: 0,
      linkPrice: 0,
      contentHash: '',
      txMsg: null,
      txContext: null,
      txBody: null,
      txHeight: null,
      txHash: null,
      error: null,
      errorMessage: null,
      file: null,
      fromCid: null,
      toCid: null,
    });
    this.timeOut = null;
  };

  onClickInitStage = () => {
    this.cleatState();
    this.setState({
      stage: STAGE_INIT,
    });
  };

  onClickInitLedger = async () => {
    const { defaultAccountsKeys } = this.props;

    if (defaultAccountsKeys === 'keplr') {
      await this.setState({
        stage: STAGE_IPFS_HASH,
      });
      this.calculationIpfsFrom();
      this.calculationIpfsTo();
    }
  };

  onClickClear = () => {
    this.setState({
      file: null,
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

  render() {
    const {
      address,
      connectLedger,
      bandwidth,
      contentHash,
      returnCode,
      ledgerVersion,
      stage,
      txMsg,
      txHeight,
      txHash,
      errorMessage,
      file,
      linkPrice,
      textBtn,
      placeholder,
    } = this.state;

    const { stageTweetActionBar, defaultAccountsKeys } = this.props;
    console.log('stageTweetActionBar', stageTweetActionBar);
    console.log('defaultAccountsKeys :>> ', defaultAccountsKeys);

    if (stage === STAGE_INIT && defaultAccountsKeys === 'read-only') {
      return (
        <ActionBar>
          <ActionBarContentText>Only CLI can be used</ActionBarContentText>
        </ActionBar>
      );
    }

    if (
      stage === STAGE_INIT &&
      stageTweetActionBar === POCKET.STAGE_TWEET_ACTION_BAR.FOLLOW &&
      defaultAccountsKeys === 'keplr'
    ) {
      return (
        <ActionBar>
          <Pane>
            <Button onClick={this.onClickInitLedger}>
              Follow cyber~Congress
            </Button>
          </Pane>
        </ActionBar>
      );
    }

    if (
      stage === STAGE_INIT &&
      stageTweetActionBar !== POCKET.STAGE_TWEET_ACTION_BAR.FOLLOW &&
      defaultAccountsKeys === 'keplr'
    ) {
      return (
        <StartStageSearchActionBar
          textBtn={textBtn}
          placeholder={placeholder}
          onClickBtn={this.onClickInitLedger}
          contentHash={
            file !== null && file !== undefined ? file.name : contentHash
          }
          onChangeInputContentHash={this.onChangeInput}
          inputOpenFileRef={this.inputOpenFileRef}
          showOpenFileDlg={this.showOpenFileDlg}
          onChangeInput={this.onFilePickerChange}
          onClickClear={this.onClickClear}
          file={file}
          keys={defaultAccountsKeys}
        />
      );
    }

    if (stage === STAGE_IPFS_HASH) {
      return (
        <ActionBar>
          <ActionBarContentText>
            adding content to IPFS <Dots big />
          </ActionBarContentText>
        </ActionBar>
      );
    }

    if (stage === STAGE_KEPLR_APPROVE) {
      return (
        <ActionBar>
          <ActionBarContentText>
            approve TX <Dots big />
          </ActionBarContentText>
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
      return (
        <ActionBar>
          <ActionBarContentText>
            transaction generation <Dots big />
          </ActionBarContentText>
        </ActionBar>
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

    if (stage === STAGE_ERROR && errorMessage !== null) {
      return (
        <TransactionError
          errorMessage={errorMessage}
          onClickBtn={this.onClickInitStage}
          onClickBtnCloce={this.onClickInitStage}
        />
      );
    }

    return null;
  }
}

const mapStateToProps = (store) => {
  return {
    stageTweetActionBar: store.pocket.actionBar.tweet,
    defaultAccount: store.pocket.defaultAccount,
  };
};

// temp
export const withIpfsAndKeplr = (Component) => (props) => {
  const { node } = useIpfs();
  const { signer, signingClient } = useSigningClient(AppContext);
  return (
    <Component
      {...props}
      node={node}
      signer={signer}
      signingClient={signingClient}
    />
  );
};

export default withIpfsAndKeplr(connect(mapStateToProps)(ActionBarTweet));
