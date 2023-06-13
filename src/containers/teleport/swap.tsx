import { MainContainer } from 'src/components';
import useGetTotalSupply from 'src/hooks/useGetTotalSupply';
import { CYBER } from 'src/utils/config';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import TokenSetterSwap from './comp/TokenSetterSwap';
import { getBalances, useGetSwapPrice } from './hooks';
import { sortReserveCoinDenoms, calculatePairAmount } from './utils';
import Slider from './components/slider';

const tokenADefaultValue = CYBER.DENOM_CYBER;
const tokenBDefaultValue = CYBER.DENOM_LIQUID_TOKEN;

function Swap() {
  const { traseDenom } = useIbcDenom();
  const queryClient = useQueryClient();

  const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const poolsData = usePoolListInterval({ refetchInterval: 50000 });
  const [update, setUpdate] = useState(0);
  const { liquidBalances: accountBalances } = getBalances(
    addressActive,
    update
  );
  const { totalSupplyProofList: totalSupply } = useGetTotalSupply();
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

  // console.log('selectedPool', selectedPool)

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
    (values: string, e: React.ChangeEvent) => {
      const inputAmount = values;
      let counterPairAmount = new BigNumber(0);

      const isReverse = e.target.id !== 'tokenAAmount';

      if (tokenAPoolAmount && tokenAPoolAmount && traseDenom) {
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
        setTokenBAmount(new BigNumber(inputAmount).toString());
        setTokenAAmount(counterPairAmount.toString());
      } else {
        setTokenAAmount(new BigNumber(inputAmount).toString());
        setTokenBAmount(counterPairAmount.toString());
      }
    },
    [tokenB, tokenA, tokenBPoolAmount, tokenAPoolAmount, traseDenom]
  );

  console.log('swapPrice', poolPrice);

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

  // console.log('useGetSlippage', useGetSlippage);

  console.log('poolPrice', poolPrice);

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
    console.log('tokenChange');
    const A = tokenB;
    const B = tokenA;

    setTokenA(A);
    setTokenB(B);
    setTokenAAmount('');
    setTokenBAmount('');
  }

  const updateFunc = () => {
    setUpdate((item) => item + 1);
  };

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
        const amount1 = getDisplayAmount(amount, coinDecimals);
        setTokenAAmount(amount1);
      }
    },
    [accountBalances, tokenA, traseDenom]
  );

  return (
    <MainContainer width="62%">
      <div
        style={{
          width: '375px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <TokenSetterSwap
          id="tokenAAmount"
          listTokens={totalSupply}
          accountBalances={accountBalances}
          tokenAmountValue={tokenAAmount}
          valueSelect={tokenA}
          selected={tokenB}
          onChangeSelect={setTokenA}
          amountChangeHandler={amountChangeHandler}
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
          id="tokenBAmount"
          listTokens={totalSupply}
          accountBalances={accountBalances}
          tokenAmountValue={tokenBAmount}
          valueSelect={tokenB}
          selected={tokenA}
          onChangeSelect={setTokenB}
          amountChangeHandler={amountChangeHandler}
        />
      </div>
    </MainContainer>
  );
}

export default Swap;