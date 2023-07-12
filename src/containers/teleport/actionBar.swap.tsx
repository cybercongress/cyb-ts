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
import { RootState } from 'src/redux/store';
import ActionBarPingTxs from './actionBarPingTxs';
import { useNavigate } from 'react-router-dom';
import { sortReserveCoinDenoms } from './utils';

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
  const navigate = useNavigate();
  const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const { signingClient, signer } = useSigningClient();
  const { traseDenom } = useIbcDenom();
  const [stage, setStage] = useState(STAGE_INIT);
  const [txHash, setTxHash] = useState<Option<string>>(undefined);
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
    swapPrice,
    poolPrice,
  } = stateActionBar;

  const swapWithinBatch = async () => {
    if (signer && signingClient && traseDenom) {
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
    setErrorMessage(undefined);
  };

  const createPool = useCallback(() => {
    const sortCoin = sortReserveCoinDenoms(tokenA, tokenB);
    navigate(`/warp/create-pool?from=${sortCoin[0]}&to=${sortCoin[1]}`);
  }, [tokenA, tokenB, navigate]);

  if (!poolPrice && stage === STAGE_INIT) {
    return (
      <ActionBarCenter
        button={{
          text: 'Create pool',
          onClick: createPool,
        }}
      />
    );
  }

  if (stage === STAGE_INIT) {
    return (
      <ActionBarCenter
        button={{
          text: 'Swap',
          onClick: swapWithinBatch,
          disabled: isExceeded,
        }}
      />
    );
  }

  const stageActionBarStaps = {
    stage,
    setStage,
    cleatState,
    updateFunc,
    txHash,
    errorMessageProps: errorMessage,
  };

  return <ActionBarPingTxs stageActionBarStaps={stageActionBarStaps} />;
}

export default ActionBar;
