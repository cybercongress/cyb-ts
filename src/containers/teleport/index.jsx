import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, Route } from 'react-router-dom';
import { Pane } from '@cybercongress/gravity';
import useSWR from 'swr';
import { AppContext } from '../../context';
import { CYBER, DEFAULT_GAS_LIMITS } from '../../utils/config';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import {
  reduceBalances,
  formatNumber,
  coinDecimals,
  roundNumber,
  exponentialToDecimal,
} from '../../utils/utils';
import { Dots, ValueImg, ButtonIcon } from '../../components';
import {
  calculateCounterPairAmount,
  calculateSlippage,
  sortReserveCoinDenoms,
  getMyTokenBalance,
  reduceAmounToken,
  getPoolToken,
} from './utils';
import { TabList } from './components';
import ActionBar from './actionBar';
import PoolsList from './poolsList';
import { useGetParams, usePoolListInterval } from './hooks/useGetPools';
import getBalances from './hooks/getBalances';
import Swap from './swap';
import Withdraw from './withdraw';
import PoolData from './poolData';

function Teleport({ defaultAccount }) {
  const { jsCyber } = useContext(AppContext);
  const location = useLocation();
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const { liquidBalances: accountBalances } = getBalances(addressActive);
  const [update, setUpdate] = useState(0);
  const { params } = useGetParams();
  const { poolsData } = usePoolListInterval();
  // const [accountBalances, setAccountBalances] = useState(null);
  const [tokenA, setTokenA] = useState('');
  const [tokenB, setTokenB] = useState('');
  const [tokenAAmount, setTokenAAmount] = useState('');
  const [tokenBAmount, setTokenBAmount] = useState('');
  const [tokenAPoolAmount, setTokenAPoolAmount] = useState(0);
  const [tokenBPoolAmount, setTokenBPoolAmount] = useState(0);
  const [selectedPool, setSelectedPool] = useState([]);
  const [swapPrice, setSwapPrice] = useState(0);
  const [tokenPrice, setTokenPrice] = useState(null);
  const [selectedTab, setSelectedTab] = useState('swap');
  const [totalSupply, setTotalSupply] = useState(null);
  const [myPools, setMyPools] = useState({});
  const [selectMyPool, setSelectMyPool] = useState('');
  const [amountPoolCoin, setAmountPoolCoin] = useState('');
  const [isExceeded, setIsExceeded] = useState(false);

  useEffect(() => {
    const { pathname } = location;
    if (
      pathname.match(/add-liquidity/gm) &&
      pathname.match(/add-liquidity/gm).length > 0
    ) {
      setSelectedTab('add-liquidity');
    } else if (
      pathname.match(/sub-liquidity/gm) &&
      pathname.match(/sub-liquidity/gm).length > 0
    ) {
      setSelectedTab('sub-liquidity');
    } else if (
      pathname.match(/pools/gm) &&
      pathname.match(/pools/gm).length > 0
    ) {
      setSelectedTab('pools');
    } else {
      setSelectedTab('swap');
    }
  }, [location.pathname]);

  useEffect(() => {
    setTokenA('');
    setTokenB('');
    setTokenAAmount('');
    setTokenBAmount('');
    setSelectMyPool('');
    setAmountPoolCoin('');
    setIsExceeded(false);
  }, [update, selectedTab]);

  // useEffect(() => {
  //   const getBalances = async () => {
  //     if (jsCyber !== null && addressActive !== null && addressActive.bech32) {
  //       const getAllBalancesPromise = await jsCyber.getAllBalances(
  //         addressActive.bech32
  //       );

  //       const datareduceBalances = reduceBalances(getAllBalancesPromise);
  //       // console.log(`reduceBalances`, datareduceBalances);
  //       setAccountBalances(datareduceBalances);
  //     }
  //   };
  //   getBalances();
  // }, [jsCyber, addressActive, update]);

  useEffect(() => {
    const getTotalSupply = async () => {
      if (jsCyber !== null) {
        const responseTotalSupply = await jsCyber.totalSupply();

        const datareduceTotalSupply = reduceBalances(responseTotalSupply);
        // console.log(`reduceBalances`, datareduceTotalSupply);
        setTotalSupply(datareduceTotalSupply);
      }
    };
    getTotalSupply();
  }, [jsCyber]);

  useEffect(() => {
    let orderPrice = 0;

    let poolAmountA = tokenAPoolAmount;
    let poolAmountB = tokenBPoolAmount;

    if (poolAmountA && poolAmountB) {
      poolAmountA = reduceAmounToken(tokenAPoolAmount, tokenA, true);
      poolAmountB = reduceAmounToken(tokenBPoolAmount, tokenB, true);
    }

    if ([tokenA, tokenB].sort()[0] !== tokenA) {
      orderPrice = (Number(poolAmountB) / Number(poolAmountA)) * 0.97;
    } else {
      orderPrice = (Number(poolAmountA) / Number(poolAmountB)) * 1.03;
    }
    console.log(`orderPrice`, orderPrice);
    if (orderPrice && orderPrice !== Infinity) {
      setSwapPrice(orderPrice);
    }
  }, [tokenA, tokenB, tokenAPoolAmount, tokenBPoolAmount]);

  useEffect(() => {
    const getAmountPool = async () => {
      setTokenAPoolAmount(0);
      setTokenBPoolAmount(0);
      if (jsCyber !== null && Object.keys(selectedPool).length > 0) {
        const getAllBalancesPromise = await jsCyber.getAllBalances(
          selectedPool.reserve_account_address
        );
        const dataReduceBalances = reduceBalances(getAllBalancesPromise);
        if (dataReduceBalances[tokenA] && dataReduceBalances[tokenB]) {
          setTokenAPoolAmount(dataReduceBalances[tokenA]);
          setTokenBPoolAmount(dataReduceBalances[tokenB]);
          setTokenAPoolAmount(
            reduceAmounToken(dataReduceBalances[tokenA], tokenA)
          );
          setTokenBPoolAmount(
            reduceAmounToken(dataReduceBalances[tokenB], tokenB)
          );
        }
      }
    };
    getAmountPool();
  }, [jsCyber, tokenA, tokenB, selectedPool, update]);

  useEffect(() => {
    setSelectedPool([]);
    if (poolsData.length > 0) {
      if (tokenA.length > 0 && tokenB.length > 0) {
        console.log(`setSelectedPool`);
        const arrangedReserveCoinDenoms = sortReserveCoinDenoms(tokenA, tokenB);
        poolsData.forEach((item) => {
          if (
            JSON.stringify(item.reserve_coin_denoms) ===
            JSON.stringify(arrangedReserveCoinDenoms)
          ) {
            setSelectedPool(item);
          }
        });
      }
    }
  }, [poolsData, tokenA, tokenB]);

  useEffect(() => {
    if (accountBalances !== null && poolsData !== null) {
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
    if (accountBalances !== null) {
      if (
        selectedTab === 'swap' &&
        Object.prototype.hasOwnProperty.call(accountBalances, tokenA) &&
        accountBalances[tokenA] > 0
      ) {
        exceeded = false;
      }
      if (
        selectedTab === 'add-liquidity' &&
        Object.prototype.hasOwnProperty.call(accountBalances, tokenA) &&
        Object.prototype.hasOwnProperty.call(accountBalances, tokenB) &&
        accountBalances[tokenA] > 0 &&
        accountBalances[tokenB] > 0
      ) {
        exceeded = false;
      }
    }
    setIsExceeded(exceeded);
  }, [accountBalances, tokenA, tokenB, selectedTab]);

  function getMyTokenBalanceNumber(denom, indexer) {
    return Number(getMyTokenBalance(denom, indexer).split(':')[1].trim());
  }

  function amountChangeHandler(e) {
    const inputAmount = e.target.value;
    const myATokenBalance = getMyTokenBalanceNumber(tokenA, accountBalances);
    const isReverse = e.target.id !== 'tokenAAmount';
    const state = { tokenAPoolAmount, tokenBPoolAmount };

    let type = 'swap';

    if (selectedTab !== 'swap') {
      type = 'deposit';
    }

    let exceeded = false;
    const { counterPairAmount, price } = calculateCounterPairAmount(
      e,
      state,
      type
    );

    // is exceeded?(좌변에 fee 더해야함)
    if (isReverse) {
      // input from "to"(reverse)
      setTokenBAmount(inputAmount);
      setTokenAAmount(counterPairAmount);

      if (counterPairAmount > myATokenBalance) {
        exceeded = true;
      }
    } else {
      // input from "from"(normal)
      setTokenAAmount(inputAmount);
      setTokenBAmount(counterPairAmount);

      if (inputAmount > myATokenBalance) {
        exceeded = true;
      }
    }
    // console.log(`price`, price);

    // setSlippage(slippage);
    setIsExceeded(exceeded);
    // setTokenPrice(price);
    // helper
  }

  const onChangeInputWithdraw = (e) => {
    const inputAmount = e.target.value;
    const myATokenBalance = getMyTokenBalanceNumber(
      selectMyPool,
      accountBalances
    );
    let exceeded = false;
    if (parseFloat(inputAmount) > myATokenBalance) {
      exceeded = true;
    }
    setIsExceeded(exceeded);
    setAmountPoolCoin(inputAmount);
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

  const stateActionBar = {
    addressActive,
    tokenAAmount,
    tokenBAmount,
    tokenA,
    tokenB,
    params,
    swapPrice,
    selectedPool,
    selectedTab,
    updateFunc,
    selectMyPool,
    myPools,
    amountPoolCoin,
    isExceeded,
  };

  const stateSwap = {
    accountBalances,
    totalSupply,
    tokenB,
    setTokenB,
    tokenBAmount,
    tokenA,
    setTokenA,
    tokenAAmount,
    amountChangeHandler,
    tokenAPoolAmount,
    tokenBPoolAmount,
    tokenChange,
    swapPrice,
  };

  const stateWithdraw = {
    accountBalances,
    myPools,
    selectMyPool,
    setSelectMyPool,
    amountPoolCoin,
    onChangeInputWithdraw,
  };

  let content;

  if (selectedTab === 'swap') {
    content = (
      <Route
        path="/teleport"
        render={() => <Swap swap stateSwap={stateSwap} />}
      />
    );
  }

  if (selectedTab === 'add-liquidity') {
    content = (
      <Route
        path="/teleport/add-liquidity"
        render={() => <Swap stateSwap={stateSwap} />}
      />
    );
  }

  if (selectedTab === 'sub-liquidity') {
    content = (
      <Route
        path="/teleport/sub-liquidity"
        render={() => <Withdraw stateSwap={stateWithdraw} />}
      />
    );
  }

  if (selectedTab === 'pools') {
    content = (
      <Route
        path="/teleport/pools"
        render={() => (
          <PoolData
            data={poolsData}
            totalSupplyData={totalSupply}
            accountBalances={accountBalances}
          />
        )}
      />
    );
  }

  return (
    <>
      <main className="block-body">
        {selectedTab !== 'pools' && <TabList selected={selectedTab} />}

        <Pane
          width="100%"
          display="flex"
          alignItems="center"
          flexDirection="column"
          // height="84vh"
        >
          {content}
        </Pane>

        {/* <PoolsList
          poolsData={poolsData}
          accountBalances={accountBalances}
          totalSupply={totalSupply}
          selectedTab={selectedTab}
        /> */}
      </main>
      <ActionBar
        addressActive={addressActive}
        stateActionBar={stateActionBar}
      />
    </>
  );
}

const mapStateToProps = (store) => {
  return {
    mobile: store.settings.mobile,
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(Teleport);
