/* eslint-disable */
// @ts-expect-error
import { ActionBar, Pane } from '@cybercongress/gravity';
import React, { Component, FC, useCallback, useEffect, useState } from 'react';
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
  LSAddress,
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
import { useAppDispatch } from 'src/redux/hooks';
import { OfflineSigner } from '@cosmjs/proto-signing';

const imgKeplr = require('../../image/keplr-icon.svg');
const imgLedger = require('../../image/ledger.svg');
const imgCyber = require('../../image/blue-circle.png');

// generated
interface Props extends ConnectedProps<typeof connector> {
  textBtn?: string;
  placeholder?: string;
  rankLink?: string;
  update: () => void;
  signer?: OfflineSigner;
  ipfsApi: BackgroundWorker['ipfsApi'];
  senseApi: SenseApi;
  signingClient: any;
  keywordHash: string;
}

class TxError extends Error {
  height?: string | null;

  constructor(message: string, height?: string) {
    super(message);

    height = height;
  }
}

const getConfirmTxErrorMessage = (
  data: { code?: string; raw_log?: string } | null
): string =>
  data === null
    ? 'Transaction data is null'
    : data.code && data.raw_log
    ? data.raw_log
    : 'Data logs are empty';
const getGenerateTxErrorMessage = (address: string) =>
  `Add address ${trimString(address, 9, 5)} to your pocket or make active `;

// TODO: REFACT
let timeOut: any = null;
let transport: any = null;
const ActionBarContainer: FC<Props> = ({
  defaultAccount,
  ipfsApi,
  contentHash,
  address,
  actionBarStage: stage,
  txHeight,
  txHash,
  errorMessage,
  textBtn,
  placeholder,
  rankLink,
  keywordHash,
  toCid,
  fromCid,
  signer,
  signingClient,
  senseApi,
  address: addressLocalStor,
  update,
}) => {
  const dispatch = useAppDispatch();
  const inputOpenFileRef: any = React.createRef();
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    checkAddressLocalStorage();
  }, [defaultAccount]);

  const checkAddressLocalStorage = useCallback(async () => {
    const { account } = defaultAccount;
    if (
      account === null ||
      !('cyber' in account) ||
      account?.cyber?.keys === 'read-only'
    ) {
      dispatch(setLSAddress(undefined));
      return;
    }

    const { keys, bech32 } = account.cyber;
    dispatch(
      setLSAddress({
        address: bech32,
        keys,
      })
    );
  }, [defaultAccount]);

  const calculationIpfsTo = useCallback(async () => {
    const content: string | File = file !== null ? file : contentHash;
    const shouldNotAdd =
      file === null &&
      typeof content === 'string' &&
      content.match(PATTERN_IPFS_HASH);

    console.log('toCid', content);

    const newToCid = shouldNotAdd
      ? content
      : (await ipfsApi.addContent(content)) ?? null;

    dispatch(setToCid(newToCid));

    return newToCid;
  }, [file, contentHash, ipfsApi]);

  const calculationIpfsFrom = useCallback(async () => {
    const newFromCid = !keywordHash.match(PATTERN_IPFS_HASH)
      ? (await ipfsApi.addContent(keywordHash)) ?? null
      : keywordHash;

    dispatch(setFromCid(newFromCid));

    return newFromCid;
  }, [file, keywordHash, ipfsApi]);

  const generateTx = async (to: any, from: any) => {
    try {
      dispatch(setActionBarStage(ActionBarStates.STAGE_KEPLR_APPROVE));

      if (!signer || !signingClient) {
        throw new TxError(`${signer ? 'Signer' : 'Signing client'} is not set`);
      }

      const [{ address }] = await signer.getAccounts();

      if (
        addressLocalStor === null ||
        addressLocalStor?.address !== address ||
        !from ||
        !to
      ) {
        throw new TxError(getGenerateTxErrorMessage(address));
      }

      const txHash = await sendCyberlink(address, from, to, {
        signingClient,
        senseApi,
      });

      console.log('hash :>> ', txHash);

      dispatch(setActionBarStage(ActionBarStates.STAGE_SUBMITTED));
      dispatch(setTxHash(txHash));

      timeOut = setTimeout(confirmTx, 1500);
    } catch (error) {
      console.log(`[ActionBarContainer] generateTx error:`, error);

      dispatch(setActionBarStage(ActionBarStates.STAGE_ERROR));
      dispatch(setTxHash(null));
      dispatch(
        setErrorMessage(
          error instanceof Error ? error.message : 'unknown error'
        )
      );
    }
  };

  const onClickInitKeplr = async () => {
    const newFromCID = await calculationIpfsFrom();
    const newToCID = await calculationIpfsTo();

    if (newToCID !== null && newFromCID !== null) {
      dispatch(setActionBarStage(ActionBarStates.STAGE_IPFS_HASH));
      generateTx(newToCID, newFromCID);
    }
  };

  const confirmTx = async () => {
    try {
      if (!txHash) {
        throw new TxError('txHash is null');
      }

      dispatch(setActionBarStage(ActionBarStates.STAGE_CONFIRMING));

      const data = await getTxs(txHash);
      if (data === null || data?.code || !data?.logs) {
        const message = getConfirmTxErrorMessage(data);

        throw new TxError(message, data?.height);
      }

      dispatch(setActionBarStage(ActionBarStates.STAGE_CONFIRMED));
      dispatch(setTxHeight(data.txHeight));

      update?.();
    } catch (error) {
      dispatch(setActionBarStage(ActionBarStates.STAGE_ERROR));
      if (error instanceof TxError && error.height) {
        dispatch(setTxHeight(error.height));
      }
      dispatch(
        setErrorMessage(
          error instanceof Error ? error.message : 'unknown error'
        )
      );
    }

    // FIXME: WTF? Neverend story 🦄
    timeOut = setTimeout(confirmTx, 1500);
  };

  const onChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setContentHash(e.target.value));
  };

  const clearState = () => {
    dispatch(clearActionBarState());
    clearTimeout(timeOut);
  };

  const onClickInitStage = () => {
    clearState();

    dispatch(setActionBarStage(ActionBarStates.STAGE_INIT));
  };

  const onClickClear = () => {
    setFile(null);
  };

  const showOpenFileDlg = () => {
    inputOpenFileRef.current.click();
  };

  const onFilePickerChange = (
    fileInputRef: React.RefObject<HTMLInputElement>
  ) => {
    const file = fileInputRef.current?.files?.[0] ?? null;

    setFile(file);
  };

  const onClickBtnRank = async () => {
    if (rankLink !== null) {
      dispatch(setContentHash(rankLink ?? ''));
    }

    const addr = (address ??
      (await signer?.getAccounts())?.[0].address) as unknown as LSAddress;

    if (addr?.keys === 'keplr') {
      onClickInitKeplr();
    }
  };

  const onClickInit = async () => {
    const addr = (address ??
      (await signer?.getAccounts())?.[0].address) as unknown as LSAddress;

    if (addr?.keys === 'keplr') {
      onClickInitKeplr();
    }
  };

  if (stage === ActionBarStates.STAGE_INIT && rankLink && rankLink !== null) {
    const image =
      !address?.keys || address?.keys === 'ledger' ? imgLedger : imgKeplr;

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
            onClick={onClickBtnRank}
            img={image}
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
        onClickBtn={onClickInit}
        contentHash={file?.name || contentHash}
        onChangeInputContentHash={onChangeInput}
        inputOpenFileRef={inputOpenFileRef}
        showOpenFileDlg={showOpenFileDlg}
        onChangeInput={onFilePickerChange}
        onClickClear={onClickClear}
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
        onClickBtnClose={onClickInitStage}
      />
    );
  }

  if (stage === ActionBarStates.STAGE_ERROR && errorMessage !== null) {
    return (
      <TransactionError
        errorMessage={errorMessage}
        onClickBtn={onClickInitStage}
      />
    );
  }

  return null;
};

const connector = connect((state: RootState) => ({
  defaultAccount: state.pocket.defaultAccount,
  actionBarStage: state.actionBar.stage,
  address: state.actionBar.address,
  contentHash: state.actionBar.contentHash,
  toCid: state.actionBar.toCid,
  fromCid: state.actionBar.fromCid,
  txHash: state.actionBar.txHash,
  txHeight: state.actionBar.txHeight,
  errorMessage: state.actionBar.errorMessage,
}));

const ActionBarHOC = withIpfsAndKeplr(connector(ActionBarContainer));

export default ActionBarHOC;
