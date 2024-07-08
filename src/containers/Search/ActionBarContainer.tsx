/* eslint-disable */
// @ts-expect-error
import { ActionBar, Pane } from '@cybercongress/gravity';
import React, { Component } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import {
  ActionBarContentText,
  ButtonImgText,
  Confirmed,
  Dots,
  StartStageSearchActionBar,
  TransactionError,
  TransactionSubmitted,
} from '../../components';

import { getTxs } from '../../utils/search/utils';

import { PATTERN_IPFS_HASH } from 'src/constants/patterns';
import { SenseApi } from 'src/contexts/backend/services/senseApi';
import withIpfsAndKeplr from 'src/hocs/withIpfsAndKeplr';
import {
  clearActionBarState,
  setActionBarStage,
  setContentHash,
  setErrorMessage,
  setFromCid,
  setLSAddress,
  setToCid,
  setTxHash,
  setTxHeight,
} from 'src/redux/features/action-bar';
import type { RootState } from 'src/redux/store';
import { BackgroundWorker } from 'src/services/backend/workers/background/worker';
import { sendCyberlink } from 'src/services/neuron/neuronApi';
import { trimString } from '../../utils/utils';
import { ActionBarStates } from './constants';

const imgKeplr = require('../../image/keplr-icon.svg');
const imgLedger = require('../../image/ledger.svg');
const imgCyber = require('../../image/blue-circle.png');

// generated
interface Props extends ConnectedProps<typeof connector> {
  textBtn?: string;
  placeholder?: string;
  rankLink?: string;
  update: () => void;
  signer: any;
  ipfsApi: BackgroundWorker['ipfsApi'];
  senseApi: SenseApi;
  signingClient: any;
  keywordHash: string;
}

class TxError extends Error {
  height?: string | null;

  constructor(message: string, height?: string) {
    super(message);

    this.height = height;
  }
}

// TODO: REFACT
class ActionBarContainer extends Component<Props, { file: File | null }> {
  timeOut: any;
  inputOpenFileRef: any;
  transport: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      file: null,
    };

    this.timeOut = null;
    this.inputOpenFileRef = React.createRef();
    this.transport = null;
  }

  componentDidMount() {
    this.checkAddressLocalStorage();
  }

  componentDidUpdate(prevProps: Props) {
    const { defaultAccount } = this.props;

    if (prevProps.defaultAccount.name !== defaultAccount.name) {
      this.checkAddressLocalStorage();
    }
  }

  checkAddressLocalStorage = async () => {
    const { defaultAccount, setLSAddress } = this.props;
    const { account } = defaultAccount;
    if (
      account === null ||
      !('cyber' in account) ||
      account?.cyber?.keys === 'read-only'
    ) {
      setLSAddress(undefined);
      return;
    }

    const { keys, bech32 } = account.cyber;
    setLSAddress({
      address: bech32,
      keys,
    });
  };

  calculationIpfsTo = async () => {
    const { file } = this.state;
    const { ipfsApi, contentHash, setToCid } = this.props;
    let content: string | File = '';
    let toCid;

    content = contentHash;
    if (file !== null) {
      content = file;
    }

    console.log('toCid', content);

    if (
      file === null &&
      typeof content === 'string' &&
      content.match(PATTERN_IPFS_HASH)
    ) {
      toCid = content;
    } else {
      toCid = await ipfsApi.addContent(content);
    }

    setToCid(toCid ?? null);
  };

  calculationIpfsFrom = async () => {
    const { keywordHash, ipfsApi, setFromCid } = this.props;

    let fromCid = keywordHash;

    if (!fromCid.match(PATTERN_IPFS_HASH)) {
      // @ts-expect-error
      fromCid = await ipfsApi.addContent(fromCid);
    }

    setFromCid(fromCid);
  };

  onClickInitKeplr = () => {
    this.calculationIpfsFrom();
    this.calculationIpfsTo();

    setActionBarStage(ActionBarStates.STAGE_IPFS_HASH);

    const { toCid, fromCid } = this.props;
    if (toCid !== null && fromCid !== null) {
      this.generateTx();
    }
  };

  generateTx = async () => {
    const {
      signer,
      signingClient,
      senseApi,
      setActionBarStage,
      setTxHash,
      setErrorMessage,
    } = this.props;

    try {
      const { fromCid, toCid, address: addressLocalStor } = this.props;

      setActionBarStage(ActionBarStates.STAGE_KEPLR_APPROVE);

      if (!signer || !signingClient) {
        throw new TxError(`${signer ? 'Signer' : 'Signing client'} is not set`);
      }

      const { address } = (await signer.getAccounts())[0];

      if (
        addressLocalStor === null ||
        addressLocalStor?.address !== address ||
        !fromCid ||
        !toCid
      ) {
        throw new TxError(this.getGenerateTxErrorMessage(address));
      }

      const txHash = await sendCyberlink(address, fromCid, toCid, {
        signingClient,
        senseApi,
      });

      console.log('hash :>> ', txHash);

      setActionBarStage(ActionBarStates.STAGE_SUBMITTED);
      setTxHash(txHash);

      this.timeOut = setTimeout(this.confirmTx, 1500);
    } catch (error) {
      console.log(`[ActionBarContainer] generateTx error:`, error);

      setActionBarStage(ActionBarStates.STAGE_ERROR);
      setTxHash(null);
      setErrorMessage(error instanceof Error ? error.message : 'unknown error');
    }
  };

  private getGenerateTxErrorMessage(address: string) {
    return `Add address ${trimString(
      address,
      9,
      5
    )} to your pocket or make active `;
  }

  confirmTx = async () => {
    const { update, txHash, setActionBarStage, setErrorMessage, setTxHeight } =
      this.props;

    try {
      if (txHash === null) {
        throw new TxError('txHash is null');
      }

      setActionBarStage(ActionBarStates.STAGE_CONFIRMING);

      const data = await getTxs(txHash);
      if (data === null || data?.code || !data?.logs) {
        const message = this.getConfirmTxErrorMessage(data);

        throw new TxError(message, data?.height);
      }

      setActionBarStage(ActionBarStates.STAGE_CONFIRMED);
      setTxHeight(data.txHeight);

      update?.();
    } catch (error) {
      setActionBarStage(ActionBarStates.STAGE_ERROR);
      if (error instanceof TxError && error.height) {
        setTxHeight(error.height);
      }
      setErrorMessage(error instanceof Error ? error.message : 'unknown error');
    }

    // FIXME: WTF? Neverend story 🦄
    this.timeOut = setTimeout(this.confirmTx, 1500);
  };

  private getConfirmTxErrorMessage(
    data: { code?: string; raw_log?: string } | null
  ): string {
    return data === null
      ? 'Transaction data is null'
      : data.code && data.raw_log
      ? data.raw_log
      : 'Data logs are empty';
  }

  onChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    this.props.setContentHash(value);
  };

  clearState = () => {
    this.props.clearActionBarState();
    this.timeOut = null;
  };

  onClickInitStage = () => {
    this.clearState();

    this.props.setActionBarStage(ActionBarStates.STAGE_INIT);
  };

  onClickClear = () => {
    this.setState({
      file: null,
    });
  };

  showOpenFileDlg = () => {
    this.inputOpenFileRef.current.click();
  };

  onFilePickerChange = (fileInputRef: React.RefObject<HTMLInputElement>) => {
    const file = fileInputRef.current?.files?.[0] ?? null;

    this.setState({
      file,
    });
  };

  onClickBtnRank = async () => {
    const { rankLink, address, setContentHash } = this.props;
    if (rankLink !== null) {
      setContentHash(rankLink ?? '');
    }

    if (address?.keys === 'keplr') {
      this.onClickInitKeplr();
    }
  };

  onClickInit = () => {
    const { address } = this.props;

    if (address?.keys === 'keplr') {
      this.onClickInitKeplr();
    }
  };

  render() {
    const { file } = this.state;
    const { contentHash, address } = this.props;
    const {
      actionBarStage: stage,
      txHeight,
      txHash,
      errorMessage,
    } = this.props;

    const { textBtn, placeholder, rankLink } = this.props;

    if (stage === ActionBarStates.STAGE_INIT && rankLink && rankLink !== null) {
      let keys = 'ledger';
      if (address?.keys) {
        keys = address?.keys;
      }

      return (
        <ActionBar>
          <ActionBarContentText>
            <ButtonImgText
              text={
                <Pane alignItems="center" display="flex">
                  Learn{' '}
                  <img
                    src={imgCyber}
                    alt="cyber"
                    style={{
                      width: 20,
                      height: 20,
                      marginLeft: '5px',
                      paddingTop: '2px',
                    }}
                  />
                </Pane>
              }
              onClick={() => this.onClickBtnRank()}
              img={keys === 'ledger' ? imgLedger : imgKeplr}
            />
          </ActionBarContentText>
        </ActionBar>
      );
    }

    if (stage === ActionBarStates.STAGE_INIT) {
      return (
        <StartStageSearchActionBar
          textBtn={textBtn || 'Cyberlink'}
          keys={address?.keys}
          onClickBtn={this.onClickInit}
          contentHash={file?.name || contentHash}
          onChangeInputContentHash={this.onChangeInput}
          inputOpenFileRef={this.inputOpenFileRef}
          showOpenFileDlg={this.showOpenFileDlg}
          onChangeInput={this.onFilePickerChange}
          onClickClear={this.onClickClear}
          file={file}
          placeholder={placeholder}
        />
      );
    }

    if (stage === ActionBarStates.STAGE_IPFS_HASH) {
      return (
        <ActionBar>
          <ActionBarContentText>
            adding content to IPFS <Dots big />
          </ActionBarContentText>
        </ActionBar>
      );
    }

    if (stage === ActionBarStates.STAGE_KEPLR_APPROVE) {
      return (
        <ActionBar>
          <ActionBarContentText>
            approve TX <Dots big />
          </ActionBarContentText>
        </ActionBar>
      );
    }

    if (stage === ActionBarStates.STAGE_READY) {
      return (
        <ActionBar>
          <ActionBarContentText>
            transaction generation <Dots big />
          </ActionBarContentText>
        </ActionBar>
      );
    }

    if (
      stage === ActionBarStates.STAGE_SUBMITTED ||
      stage === ActionBarStates.STAGE_CONFIRMING
    ) {
      return <TransactionSubmitted />;
    }

    if (stage === ActionBarStates.STAGE_CONFIRMED) {
      return (
        <Confirmed
          // FIXME: need proper types
          cosmos={undefined}
          txHash={txHash}
          txHeight={txHeight}
          onClickBtnClose={this.onClickInitStage}
        />
      );
    }

    if (stage === ActionBarStates.STAGE_ERROR && errorMessage !== null) {
      return (
        <TransactionError
          errorMessage={errorMessage}
          onClickBtn={this.onClickInitStage}
        />
      );
    }

    return null;
  }
}

const connector = connect(
  (state: RootState) => ({
    defaultAccount: state.pocket.defaultAccount,
    actionBarStage: state.actionBar.stage,
    address: state.actionBar.address,
    contentHash: state.actionBar.contentHash,
    toCid: state.actionBar.toCid,
    fromCid: state.actionBar.fromCid,
    txHash: state.actionBar.txHash,
    txHeight: state.actionBar.txHeight,
    errorMessage: state.actionBar.errorMessage,
  }),
  {
    setActionBarStage,
    setToCid,
    setFromCid,
    setTxHash,
    setTxHeight,
    setLSAddress,
    setContentHash,
    setErrorMessage,
    clearActionBarState,
  }
);

const ActionBarHOC = withIpfsAndKeplr(connector(ActionBarContainer));

export default ActionBarHOC;
