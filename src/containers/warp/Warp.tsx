import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  useParams,
  createSearchParams,
  useSearchParams,
} from 'react-router-dom';
import { Pane } from '@cybercongress/gravity';
import BigNumber from 'bignumber.js';
import useGetTotalSupply from 'src/hooks/useGetTotalSupply';
import { MainContainer } from 'src/components';
import { useQueryClient } from 'src/contexts/queryClient';
import { Pool } from '@cybercongress/cyber-js/build/codec/tendermint/liquidity/v1beta1/liquidity';
import { Option } from 'src/types';
import usePoolListInterval from 'src/hooks/usePoolListInterval';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import { RootState } from 'src/redux/store';
import { CYBER } from '../../utils/config';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import { reduceBalances, getDisplayAmountReverce } from '../../utils/utils';
import TabList from './components/tabList';
import { getBalances, useGetSwapPrice } from '../teleport/hooks';
import {
  calculateCounterPairAmount,
  getMyTokenBalanceNumber,
  getPoolToken,
  sortReserveCoinDenoms,
} from '../teleport/utils';
import { MyPoolsT } from '../teleport/type';
import DepositCreatePool from './components/DepositCreatePool';
import Withdraw from './components/withdraw';
import ActionBar from './ActionBar';
import { TypeTab } from './type';

const tokenADefaultValue = CYBER.DENOM_CYBER;
const tokenBDefaultValue = CYBER.DENOM_LIQUID_TOKEN;

function Warp() {
  const queryClient = useQueryClient();
  const { traseDenom } = useIbcDenom();
  const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  const [searchParams, setSearchParams] = useSearchParams();
  const { tab = 'add-liquidity' } = useParams<{ tab: TypeTab }>();
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [update, setUpdate] = useState(0);
  const { liquidBalances: accountBalances } = getBalances(
    addressActive,
    update
  );
  const { totalSupplyProofList: totalSupply } = useGetTotalSupply();
  const poolsData = usePoolListInterval({ refetchInterval: 50000 });

  const [tokenA, setTokenA] = useState<string>(tokenADefaultValue);
  const [tokenB, setTokenB] = useState<string>(tokenBDefaultValue);
  const [tokenAAmount, setTokenAAmount] = useState<string | number>('');
  const [tokenBAmount, setTokenBAmount] = useState<string | number>('');
  const [tokenAPoolAmount, setTokenAPoolAmount] = useState<number>(0);
  const [tokenBPoolAmount, setTokenBPoolAmount] = useState<number>(0);
  const [selectedPool, setSelectedPool] = useState<Pool | undefined>(undefined);
  const [isExceeded, setIsExceeded] = useState<boolean>(false);
  const [amountPoolCoin, setAmountPoolCoin] = useState<string | number>('');
  const [myPools, setMyPools] =
    useState<Option<{ [key: string]: MyPoolsT }>>(undefined);
  const [selectMyPool, setSelectMyPool] = useState('');

  const swapPrice = useGetSwapPrice(
    tokenA,
    tokenB,
    tokenAPoolAmount,
    tokenBPoolAmount
  );
  const firstEffectOccured = useRef(false);

  useEffect(() => {
    if (firstEffectOccured.current) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const query = {
        from: tokenA,
        to: tokenB,
      };

      setSearchParams(createSearchParams(query));
    } else {
      firstEffectOccured.current = true;
      const param = Object.fromEntries(searchParams.entries());
      if (Object.keys(param).length > 0) {
        const { from, to } = param;
        setTokenA(from);
        setTokenB(to);
      }
    }

    if (tab === 'sub-liquidity') {
      setSearchParams(createSearchParams({}));
    }
  }, [tokenA, tokenB, setSearchParams, searchParams, tab]);

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

  useEffect(() => {
    // find pool for current pair
    setSelectedPool(undefined);
    if (poolsData && poolsData.length > 0) {
      if (tokenA.length > 0 && tokenB.length > 0) {
        const arrangedReserveCoinDenoms = sortReserveCoinDenoms(tokenA, tokenB);
        poolsData.forEach((item) => {
          if (
            item.reserveCoinDenoms.join() === arrangedReserveCoinDenoms.join()
          ) {
            setSelectedPool(item);
          }
        });
      }
    }
  }, [poolsData, tokenA, tokenB]);

  useEffect(() => {
    if (accountBalances !== null && poolsData && poolsData !== null) {
      const poolTokenData = getPoolToken(poolsData, accountBalances);
      let poolTokenDataIndexer = {};

      poolTokenDataIndexer = poolTokenData.reduce(
        (obj, item) => ({
          ...obj,
          [item.poolCoinDenom]: item,
        }),
        {}
      );
      setMyPools(poolTokenDataIndexer);
    }
  }, [accountBalances, poolsData]);

  useEffect(() => {
    let exceeded = true;
    const myATokenBalance = getMyTokenBalanceNumber(tokenA, accountBalances);
    const myATokenBalanceB = getMyTokenBalanceNumber(tokenB, accountBalances);

    if (accountBalances !== null) {
      const [{ coinDecimals: coinDecimalsA }] = traseDenom(tokenA);
      const [{ coinDecimals: coinDecimalsB }] = traseDenom(tokenB);

      const validTokensAB =
        Object.prototype.hasOwnProperty.call(accountBalances, tokenA) &&
        Object.prototype.hasOwnProperty.call(accountBalances, tokenB) &&
        accountBalances[tokenA] > 0 &&
        accountBalances[tokenB] > 0;

      const validTokenAmountAB =
        parseFloat(getDisplayAmountReverce(tokenAAmount, coinDecimalsA)) <=
          myATokenBalance &&
        Number(tokenAAmount) > 0 &&
        parseFloat(getDisplayAmountReverce(tokenBAmount, coinDecimalsB)) <=
          myATokenBalanceB &&
        Number(tokenBAmount) > 0;

      const resultValidSelectTokens = validTokensAB && validTokenAmountAB;

      if (
        tab === 'add-liquidity' &&
        resultValidSelectTokens &&
        swapPrice !== 0
      ) {
        exceeded = false;
      }

      if (tab === 'create-pool' && resultValidSelectTokens) {
        exceeded = false;
      }
    }
    setIsExceeded(exceeded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    accountBalances,
    tokenA,
    tokenB,
    tab,
    tokenAAmount,
    tokenBAmount,
    swapPrice,
  ]);

  const amountChangeHandler = useCallback(
    (values: string, e: React.ChangeEvent) => {
      const inputAmount = values;

      const isReverse = e.target.id !== 'tokenAAmount';
      const state = { tokenAPoolAmount, tokenBPoolAmount, tokenB, tokenA };

      let { counterPairAmount } = calculateCounterPairAmount(
        inputAmount,
        e,
        state
      );
      counterPairAmount = Math.abs(
        parseFloat(Number(counterPairAmount).toFixed(4))
      );
      if (isReverse) {
        setTokenBAmount(new BigNumber(inputAmount).toNumber());
        setTokenAAmount(counterPairAmount);
      } else {
        setTokenAAmount(new BigNumber(inputAmount).toNumber());
        setTokenBAmount(counterPairAmount);
      }
    },
    [tokenAPoolAmount, tokenBPoolAmount, tokenB, tokenA]
  );

  const amountChangeHandlerCreatePool = useCallback(
    (values: string, e: React.ChangeEvent) => {
      const inputAmount = values;

      const isReverse = e.target.id !== 'tokenAAmount';

      if (isReverse) {
        setTokenBAmount(new BigNumber(inputAmount).toNumber());
      } else {
        setTokenAAmount(new BigNumber(inputAmount).toNumber());
      }
    },
    []
  );

  const onChangeInputWithdraw = (values: string) => {
    const inputAmount = values;

    const myATokenBalance = getMyTokenBalanceNumber(
      selectMyPool,
      accountBalances
    );
    let exceeded = true;
    if (
      parseFloat(inputAmount) <= myATokenBalance &&
      parseFloat(inputAmount) > 0
    ) {
      exceeded = false;
    }
    setIsExceeded(exceeded);
    setAmountPoolCoin(new BigNumber(inputAmount).toNumber());
  };

  function tokenChange() {
    const A = tokenB;
    const B = tokenA;
    const AP = tokenBPoolAmount;
    const BP = tokenAPoolAmount;

    setTokenA(A);
    setTokenB(B);
    setTokenAAmount('');
    setTokenBAmount('');
    setTokenAPoolAmount(AP);
    setTokenBPoolAmount(BP);
  }

  const updateFunc = () => {
    setUpdate((item) => item + 1);
  };

  const stateProps = {
    accountBalances,
    tokenAAmount,
    tokenBAmount,
    tokenA,
    tokenB,
    setTokenA,
    setTokenB,
    totalSupply,
    tokenChange,
  };

  const stateWithdraw = {
    accountBalances,
    myPools,
    selectMyPool,
    setSelectMyPool,
    amountPoolCoin,
    onChangeInputWithdraw,
  };

  const stateActionBar = {
    tokenAAmount,
    tokenBAmount,
    tokenA,
    tokenB,
    selectedPool,
    updateFunc,
    isExceeded,
    tab,
    amountPoolCoin,
    myPools,
    selectMyPool,
  };

  return (
    <>
      <MainContainer width="62%">
        <TabList selected={tab} />
        <Pane
          width="375px"
          display="flex"
          alignItems="center"
          flexDirection="column"
          marginX="auto"
        >
          <Pane
            width="100%"
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            {tab === 'add-liquidity' && (
              <DepositCreatePool
                stateProps={stateProps}
                amountChangeHandler={amountChangeHandler}
              />
            )}
            {tab === 'create-pool' && (
              <DepositCreatePool
                stateProps={stateProps}
                amountChangeHandler={amountChangeHandlerCreatePool}
              />
            )}
            {tab === 'sub-liquidity' && <Withdraw stateProps={stateWithdraw} />}
          </Pane>
        </Pane>

        {/* <TraceTxTable /> */}
      </MainContainer>
      <ActionBar stateActionBar={stateActionBar} />
    </>
  );
}

export default Warp;
