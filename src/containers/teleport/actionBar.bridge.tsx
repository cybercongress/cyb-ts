import { useState, useCallback } from 'react';
import {
  ActionBar as ActionBarContainer,
  Pane,
  Button,
} from '@cybercongress/gravity';
import Long from 'long';
import BigNumber from 'bignumber.js';
import { useSigningClient } from 'src/contexts/signerClient';
import { Option } from 'src/types';
import { Coin } from '@cosmjs/launchpad';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import {
  ActionBarContentText,
  LinkWindow,
  ActionBar as ActionBarCenter,
} from '../../components';
import { DEFAULT_GAS_LIMITS, LEDGER } from '../../utils/config';
import {
  fromBech32,
  trimString,
  convertAmountReverce,
} from '../../utils/utils';
import networks from '../../utils/networkListIbc';

import { TxsType } from './type';
import ActionBarPingTxs from './actionBarPingTxs';

const {
  STAGE_INIT,
  STAGE_ERROR,
  STAGE_SUBMITTED,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
} = LEDGER;

const STAGE_CONFIRMED_IBC = 7.1;

const fee = {
  amount: [],
  gas: DEFAULT_GAS_LIMITS.toString(),
};

const coinFunc = (amount: number, denom: string): Coin => {
  return { denom, amount: new BigNumber(amount).toString(10) };
};

function ActionBar({ stateActionBar }) {
  const { signingClient, signer } = useSigningClient();
  const { traseDenom } = useIbcDenom();
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
  } = stateActionBar;

  const cleatState = () => {
    setStage(STAGE_INIT);
    setTxHash(undefined);
    setErrorMessage(undefined);
    setTxHashIbc(null);
    setLinkIbcTxs(undefined);
  };

  const depositOnClick = useCallback(async () => {
    if (signer && traseDenom) {
      const [{ address }] = await ibcClient.signer.getAccounts();
      const [{ address: counterpartyAccount }] = await signer.getAccounts();

      setStage(STAGE_SUBMITTED);

      const sourcePort = 'transfer';

      const timeoutTimestamp = Long.fromString(
        `${new Date().getTime() + 60000}000000`
      );
      const [{ coinDecimals: coinDecimalsA }] = traseDenom(denomIbc);
      const amount = convertAmountReverce(tokenAmount, coinDecimalsA);

      const transferAmount = coinFunc(amount, denomIbc);
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
      const gasEstimation = await ibcClient.simulate(address, [msg], '');
      const feeIbc = {
        amount: [],
        gas: Math.round(gasEstimation * 1.5).toString(),
      };
      try {
        const response = await ibcClient.signAndBroadcast(
          address,
          [msg],
          feeIbc,
          ''
        );
        if (response.code === 0) {
          const responseChainId = ibcClient.signer.chainId;
          setTxHashIbc(response.transactionHash);
          setLinkIbcTxs(
            `${networks[responseChainId].explorerUrlToTx.replace(
              '{txHash}',
              response.transactionHash.toUpperCase()
            )}`
          );
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ibcClient, tokenAmount, denomIbc, signingClient]);

  const withdrawOnClick = useCallback(async () => {
    if (signer && signingClient && traseDenom) {
      let prefix;
      setStage(STAGE_SUBMITTED);
      if (Object.prototype.hasOwnProperty.call(networks, networkB)) {
        prefix = networks[networkB].prefix;
      }
      const [{ address }] = await signer.getAccounts();
      const sourcePort = 'transfer';
      const counterpartyAccount = fromBech32(address, prefix);
      const timeoutTimestamp = Long.fromString(
        `${new Date().getTime() + 60000}000000`
      );
      const [{ coinDecimals: coinDecimalsA }] = traseDenom(tokenSelect);
      const amount = convertAmountReverce(tokenAmount, coinDecimalsA);
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenSelect, signer, tokenAmount, sourceChannel, networkB]);

  const buttonConfigs = {
    [TxsType.Deposit]: {
      text: 'Deposit',
      onClick: depositOnClick,
      disabled: isExceeded,
    },
    [TxsType.Withdraw]: {
      text: 'withdraw',
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
        <Button marginX={10} onClick={cleatState}>
          Fuck Google
        </Button>
      </ActionBarContainer>
    );
  }

  const stageActionBarStaps = {
    stage,
    setStage,
    updateFunc,
    cleatState,
    txHash,
    errorMessageProps: errorMessage,
  };

  return <ActionBarPingTxs stageActionBarStaps={stageActionBarStaps} />;
}

export default ActionBar;
