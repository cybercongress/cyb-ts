import { useEffect, useState, useCallback } from 'react';
import {
  ActionBar as ActionBarContainer,
  Pane,
  Button,
} from '@cybercongress/gravity';
import Long from 'long';
import BigNumber from 'bignumber.js';
import useSetActiveAddress from 'src/hooks/useSetActiveAddress';
import { useQueryClient } from 'src/contexts/queryClient';
import { useSigningClient } from 'src/contexts/signerClient';
import { Option } from 'src/types';
import { useSelector } from 'react-redux';
import { Coin } from '@cosmjs/launchpad';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import {
  ActionBarContentText,
  Account,
  LinkWindow,
  ActionBar as ActionBarCenter,
} from '../../components';
import { DEFAULT_GAS_LIMITS, LEDGER } from '../../utils/config';
import {
  fromBech32,
  trimString,
  convertAmountReverce,
  convertAmount,
} from '../../utils/utils';
import networks from '../../utils/networkListIbc';

import ActionBarStaps from './actionBarSteps';
import { TxsType } from './type';

const POOL_TYPE_INDEX = 1;

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
  const { defaultAccount } = useSelector((state) => state.pocket);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const queryClient = useQueryClient();
  const { signingClient, signer } = useSigningClient();
  const { traseDenom } = useIbcDenom();
  const [stage, setStage] = useState(STAGE_INIT);
  const [txHash, setTxHash] = useState<Option<string>>(undefined);
  const [txHashIbc, setTxHashIbc] = useState(null);
  const [linkIbcTxs, setLinkIbcTxs] = useState<Option<string>>(undefined);
  const [txHeight, setTxHeight] = useState<Option<number>>(undefined);
  const [errorMessage, setErrorMessage] =
    useState<Option<string | JSX.Element>>(undefined);

  const {
    tokenAAmount,
    tokenA,
    tokenB,
    params,
    selectedPool,
    updateFunc,
    isExceeded,
    typeTxs,
    ibcClient,
    denomIbc,
    sourceChannel,
    networkB,
    swapPrice,
  } = stateActionBar;

  useEffect(() => {
    const confirmTx = async () => {
      if (queryClient && txHash) {
        setStage(STAGE_CONFIRMING);
        const response = await queryClient.getTx(txHash);
        if (response !== null) {
          if (response.code === 0) {
            setStage(STAGE_CONFIRMED);
            setTxHeight(response.height);
            if (updateFunc) {
              updateFunc();
            }
            return;
          }
          if (response.code) {
            setStage(STAGE_ERROR);
            setTxHeight(response.height);
            setErrorMessage(response.rawLog);
            return;
          }
        }
        setTimeout(confirmTx, 1500);
      }
    };
    confirmTx();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, txHash]);

  const swapWithinBatch = async () => {
    if (signer && signingClient) {
      const [{ address }] = await signer.getAccounts();

      let amountTokenA = tokenAAmount;

      const [{ coinDecimals: coinDecimalsA }] = traseDenom(tokenA);

      amountTokenA = convertAmountReverce(amountTokenA, coinDecimalsA);

      setStage(STAGE_SUBMITTED);
      const offerCoinFee = coinFunc(
        Math.ceil(
          parseFloat(amountTokenA) *
            convertAmount(parseFloat(params.swapFeeRate), 18) *
            0.5
        ),
        tokenA
      );

      const offerCoin = coinFunc(parseFloat(amountTokenA), tokenA);
      const demandCoinDenom = tokenB;

      const exp = new BigNumber(10).pow(18).toString();
      const convertSwapPrice = new BigNumber(swapPrice)
        .multipliedBy(exp)
        .dp(0, BigNumber.ROUND_FLOOR)
        .toString(10);
      if (addressActive !== null && addressActive.bech32 === address) {
        try {
          const response = await signingClient.swapWithinBatch(
            address,
            parseFloat(selectedPool.id),
            POOL_TYPE_INDEX,
            offerCoin,
            demandCoinDenom,
            offerCoinFee,
            convertSwapPrice,
            fee
          );

          if (response.code === 0) {
            setTxHash(response.transactionHash);
          } else {
            setTxHash(undefined);
            setErrorMessage(response.rawLog.toString());
            setStage(STAGE_ERROR);
          }
        } catch (error) {
          setTxHash(undefined);
          setErrorMessage(error.toString());
          setStage(STAGE_ERROR);
        }
      } else {
        setErrorMessage(
          <span>
            Add address <Account margin="0 5px" address={address} /> to your
            pocket or make active{' '}
          </span>
        );
        setStage(STAGE_ERROR);
      }
    }
  };

  const cleatState = () => {
    setStage(STAGE_INIT);
    setTxHash(undefined);
    setTxHeight(undefined);
    setErrorMessage(undefined);
    setTxHashIbc(null);
    setLinkIbcTxs(undefined);
  };

  const depositOnClick = useCallback(async () => {
    if (signer) {
      const [{ address }] = await ibcClient.signer.getAccounts();
      const [{ address: counterpartyAccount }] = await signer.getAccounts();

      setStage(STAGE_SUBMITTED);

      const sourcePort = 'transfer';

      const timeoutTimestamp = Long.fromString(
        `${new Date().getTime() + 60000}000000`
      );
      const [{ coinDecimals: coinDecimalsA }] = traseDenom(tokenA);
      const amount = convertAmountReverce(tokenAAmount, coinDecimalsA);

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
  }, [tokenA, ibcClient, tokenAAmount, denomIbc, signingClient]);

  const withdrawOnClick = useCallback(async () => {
    if (signer && signingClient) {
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
      const [{ coinDecimals: coinDecimalsA }] = traseDenom(tokenA);
      const amount = convertAmountReverce(tokenAAmount, coinDecimalsA);
      const transferAmount = coinFunc(amount, tokenA);
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
          setTxHash(null);
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
  }, [tokenA, signer, tokenAAmount, sourceChannel, networkB]);

  const buttonConfigs = {
    [TxsType.Swap]: {
      text: 'Swap',
      onClick: swapWithinBatch,
      disabled: isExceeded,
    },
    [TxsType.Deposit]: {
      text: 'Deposit',
      onClick: depositOnClick,
      disabled: ibcClient === null,
    },
    [TxsType.Withdraw]: {
      text: 'withdraw',
      onClick: withdrawOnClick,
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
    cleatState,
    txHash,
    txHeight,
    errorMessage,
  };

  return <ActionBarStaps stageActionBarStaps={stageActionBarStaps} />;
}

export default ActionBar;
