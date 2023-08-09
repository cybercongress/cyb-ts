import { MainContainer } from 'src/components';
import useGetTotalSupply from 'src/hooks/useGetTotalSupply';
import { CYBER } from 'src/utils/config';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import useSetActiveAddress from 'src/hooks/useSetActiveAddress';
import { Pool } from '@cybercongress/cyber-js/build/codec/tendermint/liquidity/v1beta1/liquidity';
import usePoolListInterval from 'src/hooks/usePoolListInterval';
import BigNumber from 'bignumber.js';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import {
  getDisplayAmount,
  getDisplayAmountReverce,
  reduceBalances,
} from 'src/utils/utils';
import { useQueryClient } from 'src/contexts/queryClient';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import TokenSetterSwap, { TokenSetterId } from './comp/TokenSetterSwap';
import { getBalances, useGetParams, useGetSwapPrice } from './hooks';
import {
  sortReserveCoinDenoms,
  calculatePairAmount,
  getMyTokenBalanceNumber,
} from './utils';
import Slider from './components/slider';
import ActionBar from './actionBar.swap';
import { TeleportContainer } from './comp/grid';
import useGetSendTxsByAddressByType from './hooks/useGetSendTxsByAddress';
import DataSwapTxs from './comp/dataSwapTxs/DataSwapTxs';
import { Nullable } from 'src/types';

const tokenADefaultValue = CYBER.DENOM_CYBER;
const tokenBDefaultValue = CYBER.DENOM_LIQUID_TOKEN;

function Swap() {
  const { traseDenom } = useIbcDenom();
  const queryClient = useQueryClient();
  const [update, setUpdate] = useState(0);
  const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const dataSwapTxs = useGetSendTxsByAddressByType(
    addressActive,
    'tendermint.liquidity.v1beta1.MsgSwapWithinBatch'
  );
  const poolsData = usePoolListInterval({ refetchInterval: 5 * 60 * 1000 });
  const params = useGetParams();
  const { liquidBalances: accountBalances } = getBalances(
    addressActive,
    update
  );
  const { totalSupplyProofList: totalSupply } = useGetTotalSupply();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tokenA, setTokenA] = useState<string>(tokenADefaultValue);
  const [tokenB, setTokenB] = useState<string>(tokenBDefaultValue);
  const [tokenAAmount, setTokenAAmount] = useState<string>('');
  const [tokenBAmount, setTokenBAmount] = useState<string>('');
  const [tokenAPoolAmount, setTokenAPoolAmount] = useState<number>(0);
  const [tokenBPoolAmount, setTokenBPoolAmount] = useState<number>(0);
  const [selectedPool, setSelectedPool] = useState<Pool | undefined>(undefined);
  const [swapPrice, setSwapPrice] = useState<number>(0);
  const [isExceeded, setIsExceeded] = useState<boolean>(false);
  const poolPrice = useGetSwapPrice(
    tokenA,
    tokenB,
    tokenAPoolAmount,
    tokenBPoolAmount
  );
  const firstEffectOccured = useRef(false);
  const [percent, setPercent] = useState<Nullable<string>>(undefined);

  useEffect(() => {
    // find pool for current pair
    setSelectedPool(undefined);
    if (poolsData && poolsData.length > 0) {
      if (tokenA.length > 0 && tokenB.length > 0) {
        poolsData.forEach((item) => {
          if (
            sortReserveCoinDenoms(
              item.reserveCoinDenoms[0],
              item.reserveCoinDenoms[1]
            ).join() === sortReserveCoinDenoms(tokenA, tokenB).join()
          ) {
            setSelectedPool(item);
          }
        });
      }
    }
  }, [poolsData, tokenA, tokenB]);

  useEffect(() => {
    const getBalancesPoolCurrentPair = async () => {
      setTokenAPoolAmount(0);
      setTokenBPoolAmount(0);

      if (queryClient && selectedPool) {
        const getAllBalancesPromise = await queryClient.getAllBalances(
          selectedPool.reserveAccountAddress
        );
        const dataReduceBalances = reduceBalances(getAllBalancesPromise);
        if (dataReduceBalances[tokenA] && dataReduceBalances[tokenB]) {
          setTokenAPoolAmount(dataReduceBalances[tokenA]);
          setTokenBPoolAmount(dataReduceBalances[tokenB]);
        }
      }
    };
    getBalancesPoolCurrentPair();
  }, [queryClient, tokenA, tokenB, selectedPool, update]);

  const amountChangeHandler = useCallback(
    (values: string | number, id: TokenSetterId) => {
      const inputAmount = values;
      let counterPairAmount = new BigNumber(0);

      const isReverse = id !== TokenSetterId.tokenAAmount;

      if (
        tokenAPoolAmount &&
        tokenAPoolAmount &&
        traseDenom &&
        Number(inputAmount) > 0
      ) {
        const [{ coinDecimals: coinDecimalsA }] = traseDenom(tokenA);
        const [{ coinDecimals: coinDecimalsB }] = traseDenom(tokenB);

        const state = {
          tokenB,
          tokenA,
          tokenBPoolAmount,
          tokenAPoolAmount,
          coinDecimalsA,
          coinDecimalsB,
          isReverse,
        };

        const { counterPairAmount: counterPairAmountValue, price } =
          calculatePairAmount(inputAmount, state);

        counterPairAmount = counterPairAmountValue;
        setSwapPrice(price.toNumber());
      }

      if (isReverse) {
        setTokenBAmount(inputAmount);
        setTokenAAmount(counterPairAmount.toString(10));
      } else {
        setTokenAAmount(inputAmount);
        setTokenBAmount(counterPairAmount.toString(10));
      }
    },
    [tokenB, tokenA, tokenBPoolAmount, tokenAPoolAmount, traseDenom]
  );

  useEffect(() => {
    // update swap price for current amount tokenA
    if (update || new BigNumber(tokenAAmount).comparedTo(0)) {
      amountChangeHandler(tokenAAmount, TokenSetterId.tokenAAmount);
    }
  }, [update, amountChangeHandler, tokenA, tokenB]);

  const validInputAmountTokenA = useMemo(() => {
    if (traseDenom) {
      const myATokenBalance = getMyTokenBalanceNumber(tokenA, accountBalances);

      if (Number(tokenAAmount) > 0) {
        const [{ coinDecimals: coinDecimalsA }] = traseDenom(tokenA);

        const amountToken = parseFloat(
          getDisplayAmountReverce(tokenAAmount, coinDecimalsA)
        );

        return amountToken > myATokenBalance;
      }
    }
    return false;
  }, [tokenAAmount, tokenA, traseDenom, accountBalances]);

  useEffect(() => {
    // validation swap
    let exceeded = true;

    const validTokenAmountA =
      !validInputAmountTokenA && Number(tokenAAmount) > 0;

    if (poolPrice !== 0 && validTokenAmountA) {
      exceeded = false;
    }

    setIsExceeded(exceeded);
  }, [poolPrice, tokenAAmount, validInputAmountTokenA]);

  const useGetSlippage = useMemo(() => {
    if (poolPrice && swapPrice) {
      // poolPrice / price - 1
      const slippage = new BigNumber(poolPrice)
        .dividedBy(swapPrice)
        .minus(1)
        .multipliedBy(100)
        .dp(2, BigNumber.ROUND_FLOOR);

      if (slippage.comparedTo(0) < 0) {
        return slippage.multipliedBy(-1).toNumber();
      }
      return slippage.toNumber();
    }
    return 0;
  }, [poolPrice, swapPrice]);

  console.log('useGetSlippage', useGetSlippage);

  const getPrice = useMemo(() => {
    if (poolPrice && tokenA && tokenB && traseDenom) {
      const [{ coinDecimals: coinDecimalsA }] = traseDenom(tokenA);
      const [{ coinDecimals: coinDecimalsB }] = traseDenom(tokenB);

      if ([tokenA, tokenB].sort()[0] === tokenA) {
        const revPrice = new BigNumber(1)
          .dividedBy(poolPrice)
          .dp(coinDecimalsB, BigNumber.ROUND_FLOOR)
          .toNumber();
        return { to: 1, from: revPrice };
      }
      const amountTokenA = getDisplayAmountReverce(1, coinDecimalsA);
      const revPrice = new BigNumber(amountTokenA)
        .multipliedBy(poolPrice)
        .dp(3, BigNumber.ROUND_FLOOR)
        .toNumber();

      return { to: 1, from: revPrice };
    }

    return { to: 0, from: 0 };
  }, [poolPrice, tokenA, tokenB, traseDenom]);

  function tokenChange() {
    const A = tokenB;
    const B = tokenA;

    setTokenA(A);
    setTokenB(B);
    setTokenAAmount('');
    setTokenBAmount('');
  }

  const updateFunc = useCallback(() => {
    setUpdate((item) => item + 1);
    dataSwapTxs.refetch();
  }, [dataSwapTxs]);

  const setPercentageBalanceHook = useCallback(
    (value: number) => {
      if (
        accountBalances &&
        Object.prototype.hasOwnProperty.call(accountBalances, tokenA) &&
        traseDenom
      ) {
        const [{ coinDecimals }] = traseDenom(tokenA);
        const amount = new BigNumber(accountBalances[tokenA])
          .multipliedBy(value)
          .dividedBy(100)
          .dp(coinDecimals, BigNumber.ROUND_FLOOR)
          .toNumber();
        const amountDecimals = getDisplayAmount(amount, coinDecimals);
        amountChangeHandler(amountDecimals, TokenSetterId.tokenAAmount);
        setTokenAAmount(amountDecimals);
        setPercent(new BigNumber(value).toString());
      }
    },
    [accountBalances, tokenA, traseDenom, amountChangeHandler, searchParams]
  );

  useEffect(() => {
    if (firstEffectOccured.current) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const query = {
        from: tokenA,
        to: tokenB,
      };

      if (Number(tokenAAmount) > 0) {
        query.amount = tokenAAmount;
      }

      setSearchParams(createSearchParams(query));
    } else {
      firstEffectOccured.current = true;
      const param = Object.fromEntries(searchParams.entries());
      if (Object.keys(param).length > 0) {
        const { from, to, amount } = param;
        setTokenA(from);
        setTokenB(to);
        if (Number(amount) > 0) {
          setTokenAAmount(amount);
          amountChangeHandler(amount, TokenSetterId.tokenAAmount);
        }
      }
    }
  }, [
    tokenA,
    tokenB,
    tokenAAmount,
    setSearchParams,
    searchParams,
    percent,
    amountChangeHandler,
  ]);

  const stateActionBar = {
    tokenAAmount,
    tokenA,
    tokenB,
    params,
    selectedPool,
    updateFunc,
    isExceeded,
    swapPrice,
    poolPrice,
  };

  return (
    <>
      <MainContainer width="62%">
        <TeleportContainer>
          <TokenSetterSwap
            id={TokenSetterId.tokenAAmount}
            listTokens={totalSupply}
            accountBalances={accountBalances}
            tokenAmountValue={tokenAAmount}
            valueSelect={tokenA}
            selected={tokenB}
            onChangeSelect={setTokenA}
            amountChangeHandler={amountChangeHandler}
            validInputAmount={validInputAmountTokenA}
            autoFocus
          />

          <Slider
            tokenA={tokenA}
            tokenB={tokenB}
            tokenAAmount={tokenAAmount}
            setPercentageBalanceHook={setPercentageBalanceHook}
            coinReverseAction={() => tokenChange()}
            accountBalances={accountBalances}
            getPrice={getPrice}
          />

          <TokenSetterSwap
            id={TokenSetterId.tokenBAmount}
            listTokens={totalSupply}
            accountBalances={accountBalances}
            tokenAmountValue={tokenBAmount}
            valueSelect={tokenB}
            selected={tokenA}
            onChangeSelect={setTokenB}
            amountChangeHandler={amountChangeHandler}
          />
        </TeleportContainer>
        <TeleportContainer>
          <DataSwapTxs dataTxs={dataSwapTxs} />
        </TeleportContainer>
      </MainContainer>
      <ActionBar stateActionBar={stateActionBar} />
    </>
  );
}

export default Swap;
