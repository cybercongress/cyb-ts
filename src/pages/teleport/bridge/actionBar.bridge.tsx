import { useState, useCallback } from 'react';
import {
  ActionBar as ActionBarContainer,
  Pane,
  Button,
} from '@cybercongress/gravity';
import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx';
import Long from 'long';
import BigNumber from 'bignumber.js';
import { useSigningClient } from 'src/contexts/signerClient';
import { Option } from 'src/types';
import { Coin } from '@cosmjs/launchpad';
import {
  MsgTransferEncodeObject,
  SigningStargateClient,
} from '@cosmjs/stargate';
import { DEFAULT_GAS_LIMITS } from 'src/constants/config';
import {
  ActionBarContentText,
  LinkWindow,
  ActionBar as ActionBarCenter,
} from '../../../components';
import { LEDGER } from '../../../utils/config';
import {
  fromBech32,
  trimString,
  convertAmountReverce,
  getNowUtcTime,
} from '../../../utils/utils';
import networks from '../../../utils/networkListIbc';

import { TxsType, TypeTxsT } from '../type';
import ActionBarPingTxs from '../components/actionBarPingTxs';
import { useIbcHistory } from '../../../features/ibc-history/historyContext';

const { STAGE_INIT, STAGE_ERROR, STAGE_SUBMITTED } = LEDGER;

const STAGE_CONFIRMED_IBC = 7.1;

const TIMEOUT_TIMESTAMP = 2 * 60 * 1000; // 2 min

const fee = {
  amount: [],
  gas: DEFAULT_GAS_LIMITS.toString(),
};

const coinFunc = (amount: number, denom: string): Coin => {
  return { denom, amount: new BigNumber(amount).toString(10) };
};

type Props = {
  tokenAmount: string;
  tokenSelect: string;
  networkB: string;
  updateFunc: () => void;
  isExceeded: boolean;
  typeTxs: TypeTxsT;
  ibcClient: null | SigningStargateClient;
  denomIbc: null | string;
  sourceChannel: string | null;
  coinDecimals: number;
};

function ActionBar({ stateActionBar }: { stateActionBar: Props }) {
  const { pingTxsIbc } = useIbcHistory();
  const { signingClient, signer } = useSigningClient();
  const [stage, setStage] = useState(STAGE_INIT);
  const [txHash, setTxHash] = useState<Option<string>>(undefined);
  const [txHashIbc, setTxHashIbc] = useState(null);
  const [linkIbcTxs, setLinkIbcTxs] = useState<Option<string>>(undefined);
  const [errorMessage, setErrorMessage] =
    useState<Option<string | JSX.Element>>(undefined);

  const {
    tokenAmount,
    tokenSelect,
    updateFunc,
    isExceeded,
    typeTxs,
    ibcClient,
    denomIbc,
    sourceChannel,
    networkB,
    coinDecimals,
  } = stateActionBar;

  const clearState = () => {
    setStage(STAGE_INIT);
    setTxHash(undefined);
    setErrorMessage(undefined);
    setTxHashIbc(null);
    setLinkIbcTxs(undefined);
  };

  const depositOnClick = useCallback(async () => {
    if (!ibcClient || !denomIbc || !signer) {
      return;
    }

    const [{ address }] = await ibcClient.signer.getAccounts();
    const [{ address: counterpartyAccount }] = await signer.getAccounts();
    const responseChainId = await ibcClient.getChainId();

    setStage(STAGE_SUBMITTED);

    const sourcePort = 'transfer';

    const timeoutTimestamp = Long.fromString(
      `${new Date().getTime() + TIMEOUT_TIMESTAMP}000000`
    );

    const amount = convertAmountReverce(tokenAmount, coinDecimals);

    const transferAmount = coinFunc(amount, denomIbc);
    const msg: MsgTransferEncodeObject = {
      typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
      value: MsgTransfer.fromPartial({
        sourcePort,
        sourceChannel: sourceChannel || '',
        sender: address,
        receiver: counterpartyAccount,
        timeoutTimestamp: BigInt(timeoutTimestamp.toNumber()),
        token: transferAmount,
      }),
    };

    try {
      const response = await ibcClient.signAndBroadcast(
        address,
        [msg],
        1.5,
        ''
      );

      console.log('response', response);

      if (response.code === 0) {
        setTxHashIbc(response.transactionHash);
        setLinkIbcTxs(
          `${networks[responseChainId].explorerUrlToTx.replace(
            '{txHash}',
            response.transactionHash.toUpperCase()
          )}`
        );

        const transferData = {
          txHash: response.transactionHash,
          address: counterpartyAccount,
          sourceChainId: responseChainId,
          destChainId: networkB,
          sender: address,
          recipient: counterpartyAccount,
          createdAt: getNowUtcTime(),
          amount: coinFunc(amount, tokenSelect),
        };
        pingTxsIbc(ibcClient, transferData);
        setStage(STAGE_CONFIRMED_IBC);
        // if (response.rawLog.length > 0) {
        //   parseRawLog(response.rawLog);
        // }
      } else {
        setTxHashIbc(null);
        setErrorMessage(response.rawLog.toString());
        setStage(STAGE_ERROR);
      }
    } catch (e) {
      console.error(`error: `, e);
      setTxHashIbc(null);
      setErrorMessage(e.toString());
      setStage(STAGE_ERROR);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ibcClient, tokenAmount, denomIbc, signingClient, networkB]);

  const withdrawOnClick = useCallback(async () => {
    if (!signer || !signingClient) {
      return;
    }

    let prefix;
    setStage(STAGE_SUBMITTED);
    if (networks[networkB]) {
      prefix = networks[networkB].prefix;
    }
    const [{ address }] = await signer.getAccounts();
    const sourcePort = 'transfer';
    const counterpartyAccount = fromBech32(address, prefix);
    const timeoutTimestamp = Long.fromString(
      `${new Date().getTime() + TIMEOUT_TIMESTAMP}000000`
    );

    const amount = convertAmountReverce(tokenAmount, coinDecimals);
    const transferAmount = coinFunc(amount, tokenSelect);
    const msg = {
      typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
      value: {
        sourcePort,
        sourceChannel,
        sender: address,
        receiver: counterpartyAccount,
        timeoutTimestamp,
        token: transferAmount,
      },
    };
    try {
      const response = await signingClient.signAndBroadcast(
        address,
        [msg],
        fee,
        ''
      );
      if (response.code === 0) {
        setTxHash(response.transactionHash);
        const ChainId = await signingClient.getChainId();
        const transferData = {
          txHash: response.transactionHash,
          address,
          sourceChainId: ChainId,
          destChainId: networkB,
          sender: address,
          recipient: counterpartyAccount,
          createdAt: getNowUtcTime(),
          amount: transferAmount,
        };
        pingTxsIbc(signingClient, transferData);
      } else {
        setTxHash(undefined);
        setErrorMessage(response.rawLog.toString());
        setStage(STAGE_ERROR);
      }
    } catch (e) {
      console.error(`error: `, e);
      setTxHash(undefined);
      setErrorMessage(e.toString());
      setStage(STAGE_ERROR);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenSelect, signer, tokenAmount, sourceChannel, networkB]);

  const buttonConfigs = {
    [TxsType.Deposit]: {
      text: 'transfer',
      // onClick: () => addHistoriesItem(testItem),
      onClick: depositOnClick,
      disabled: isExceeded,
    },
    [TxsType.Withdraw]: {
      text: 'transfer',
      onClick: withdrawOnClick,
      disabled: isExceeded,
    },
  };

  if (stage === STAGE_INIT) {
    return <ActionBarCenter button={buttonConfigs[typeTxs]} />;
  }

  if (stage === STAGE_CONFIRMED_IBC) {
    return (
      <ActionBarContainer>
        <ActionBarContentText display="inline">
          <Pane display="inline">Transaction Successful: </Pane>{' '}
          <LinkWindow to={linkIbcTxs}>{trimString(txHashIbc, 6, 6)}</LinkWindow>
        </ActionBarContentText>
        <Button marginX={10} onClick={clearState}>
          Fuck Google
        </Button>
      </ActionBarContainer>
    );
  }

  const stageActionBarStaps = {
    stage,
    setStage,
    updateFunc,
    clearState,
    txHash,
    errorMessageProps: errorMessage,
  };

  return <ActionBarPingTxs stageActionBarStaps={stageActionBarStaps} />;
}

export default ActionBar;
