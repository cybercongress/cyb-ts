import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { connect } from 'react-redux';
import { useLocation, useHistory, Route, useParams } from 'react-router-dom';
import { Pane } from '@cybercongress/gravity';
import useSWR from 'swr';
import BigNumber from 'bignumber.js';
import queryString from 'query-string';
import { AppContext } from '../../context';
import { CYBER, DEFAULT_GAS_LIMITS } from '../../utils/config';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import { getNetworks, getTokens } from './hooks/useWarp';

import {
  reduceBalances,
  formatNumber,
  coinDecimals,
  roundNumber,
  exponentialToDecimal,
} from '../../utils/utils';
import { Dots, ValueImg, ButtonIcon } from '../../components';
import {
  // calculateCounterPairAmount,
  calculateSlippage,
  sortReserveCoinDenoms,
  getMyTokenBalance,
  reduceAmounToken,
  getPoolToken,
  getCoinDecimals,
  // networkList,
} from './utils';
import { TabList } from './components';
import ActionBar from './actionBar';
import PoolsList from './poolsList';
import { useGetParams, usePoolListInterval } from './hooks/useGetPools';
import getBalances from './hooks/getBalances';
import Swap from './swap';
import Withdraw from './withdraw';
import PoolData from './poolData';
// import coinDecimalsConfig from '../../utils/configToken';
import useSetupIbcClient from './hooks/useSetupIbcClient';
// import { networkList as networks } from './hooks/useGetBalancesIbc';

// import TracerTx from './tx/TracerTx';
// import TraceTxTable from './components/ibc-history/traceTxTable';
// import HistoryContextProvider from './components/ibc-history/historyContext';
import GetTxs from './components/txHistory/tx';

//Pool default params
const tokenADefaultValue = 'boot';
const tokenBDefaultValue = 'hydrogen';

// const txHash =
//   'E15BC5F5B62696F5D08C0860CDA13D39E385BD6245595EB07899954336760C8C';

const defaultTokenList = {
  boot: 0,
  hydrogen: 0,
  milliampere: 0,
  millivolt: 0,
  tocyb: 0,
};

const replaceFunc = (number) => {
  return number.replace(/ /g, '');
};

const numberString = (num) =>
  String(num).replace(/^\d+/, (number) =>
    [...number]
      .map(
        (digit, index, digits) =>
          (!index || (digits.length - index) % 3 ? '' : ' ') + digit
      )
      .join('')
  );

function Teleport({ defaultAccount }) {
  const { jsCyber, keplr } = useContext(AppContext);
  const location = useLocation();
  const history = useHistory();
  const { address } = useParams();
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [update, setUpdate] = useState(0);
  const { liquidBalances: accountBalances } = getBalances(
    addressActive,
    update
  );
  const { params } = useGetParams();
  const { poolsData } = usePoolListInterval();
  const { networks } = getNetworks();
  const { tokens } = getTokens();
  // const [accountBalances, setAccountBalances] = useState(null);
  const [tokenA, setTokenA] = useState(tokenADefaultValue);
  const [tokenB, setTokenB] = useState(tokenBDefaultValue);
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
  const [networkA, setNetworkA] = useState(CYBER.CHAIN_ID);
  const [networkB, setNetworkB] = useState(CYBER.CHAIN_ID);
  const [typeTxs, setTypeTxs] = useState('swap');
  const { ibcClient, balanceIbc, denomIbc } = useSetupIbcClient(
    tokenA,
    networkA,
    keplr
  );
  const [sourceChannel, setSourceChannel] = useState(null);


  let { search } = useLocation();
  // const [{ address }] = await keplr.signer.getAccounts();
  // console.log('search', search);

  // useEffect(() => {
  // const txTracerFunc = async () => {
  //   const txTracer = new TracerTx(networks.bostrom.rpc, '/websocket');
  //   console.log('txTracer', txTracer)
  //   // const result = await txTracer.traceTx(Buffer.from(txHash, 'hex'));
  //   const result = await txTracer.traceTx({
  //     'recv_packet.packet_src_channel': 'channel-95',
  //     'recv_packet.packet_sequence': '26930',
  //   });
  //   console.log('result !!!!!!!', result);
  //   txTracer.close();
  // };
  // txTracerFunc();
  // }, []);

  if (search.startsWith('?')) {
    search = search.slice(1);
  } else if (selectedTab !== 'sub-liquidity') {
    const query = {
      from: tokenA,
      to: tokenB,
    };

    const searchQuery = queryString.stringify(query);

    history.replace({
      search: searchQuery,
    });
  }

  let query = queryString.parse(search);
  const firstEffectOccured = useRef(false);

  const setPercentageBalanceHook = (value) =>
  {
    if (accountBalances && Object.prototype.hasOwnProperty.call(accountBalances, tokenA)) {
      // alert(accountBalances[tokenA] * value / 100);
      setTokenAAmount((accountBalances[tokenA] * value / 100).toString());
    }

  };

  useEffect(() => {
    // Update current in and out currency to query string.
    // The first effect should be ignored because the query string set when visiting the web page for the first time must be processed.
    if (firstEffectOccured.current) {
      // Mobx is mutable, but react's state is immutable.
      // This causes an infinite loop with other effects that use the same state
      // because the state of mobx is updated but the state of react will be updated in the next render.
      // To solve this problem, we ignore the state processing of react and change the variable itself.
      query = {
        from: tokenA,
        to: tokenB,
      };

      const searchQuery = queryString.stringify(query);

      history.replace({
        search: searchQuery,
      });
    } else {
      firstEffectOccured.current = true;
    }
  }, [tokenA, tokenB]);

  useEffect(() => {
    if (query.from) {
      setTokenA(query.from);
    }

    if (query.to) {
      setTokenB(query.to);
    }
  }, [query]);

  useEffect(() => {
    if (networkA === CYBER.CHAIN_ID && networkB === CYBER.CHAIN_ID) {
      setTypeTxs('swap');
    }

    if (networkA !== CYBER.CHAIN_ID && networkB === CYBER.CHAIN_ID) {
      setTypeTxs('deposit');
      // console.log(networks[networkList[networkA]);
      const { sourceChannelId } = networks[networkA];
      console.log('svvv',networks,networkA)
      alert(sourceChannelId)
      setSourceChannel(sourceChannelId);
    }

    if (networkA === CYBER.CHAIN_ID && networkB !== CYBER.CHAIN_ID) {
      setTypeTxs('withdraw');
      const { destChannelId } = networks[networkB];
      alert(destChannelId);
      console.log('svvv',networks,networkB)
      setSourceChannel(destChannelId);
    }
  }, [networkB, networkA]);

  useEffect(() => {
    const { pathname } = location;
    if (
      pathname.match(/add-liquidity/gm) &&
      pathname.match(/add-liquidity/gm).length > 0
    ) {
      setSelectedTab('add-liquidity');
      setNetworkA(CYBER.CHAIN_ID);
      setNetworkB(CYBER.CHAIN_ID);
    } else if (
      pathname.match(/sub-liquidity/gm) &&
      pathname.match(/sub-liquidity/gm).length > 0
    ) {
      setSelectedTab('sub-liquidity');
      history.replace({
        search: '',
      });
    } else if (
      pathname.match(/pools/gm) &&
      pathname.match(/pools/gm).length > 0
    ) {
      setSelectedTab('pools');
    } else {
      setSelectedTab('swap');
    }
  }, [location.pathname]);

  // useEffect(() => {
  //   setTokenA('');
  //   setTokenB('');
  //   setTokenAAmount('');
  //   setTokenBAmount('');
  //   setSelectMyPool('');
  //   setAmountPoolCoin('');
  //   setIsExceeded(false);
  // }, [update, selectedTab]);

  useEffect(() => {
    const getTotalSupply = async () => {
      if (jsCyber !== null) {
        const responseTotalSupply = await jsCyber.totalSupply();

        const datareduceTotalSupply = reduceBalances(responseTotalSupply);
        setTotalSupply({ ...defaultTokenList, ...datareduceTotalSupply });
      }
    };
    getTotalSupply();
  }, [jsCyber]);

  useEffect(() => {
    let orderPrice = 0;
    setSwapPrice(0);

    if (!tokens) return;
    const poolAmountA = new BigNumber(

      getCoinDecimals(tokens, Number(tokenAPoolAmount), tokenA)
    );
    const poolAmountB = new BigNumber(
      getCoinDecimals(tokens, Number(tokenBPoolAmount), tokenB)
    );

    if ([tokenA, tokenB].sort()[0] !== tokenA) {
      // const poolFee = 1 - 0.003;
      // const imputNumber = new BigNumber(tokenAAmount).multipliedBy(2);
      // const secondNumb = poolAmountA.plus(imputNumber);
      // const testPrice = poolAmountB
      //   .multipliedBy(poolFee)
      //   .dividedBy(secondNumb)
      //   .toNumber();
      // orderPrice = testPrice;
      // console.log('testPrice', testPrice);
      orderPrice = poolAmountB.dividedBy(poolAmountA);
      orderPrice = orderPrice.multipliedBy(0.97).toNumber();
    } else {
      // const poolFee = 1 - 0.003;
      // const imputNumber = new BigNumber(tokenAAmount).multipliedBy(2);
      // const secondNumb = poolAmountB.plus(imputNumber);
      // const testPrice = poolAmountA
      //   .multipliedBy(poolFee)
      //   .dividedBy(secondNumb)
      //   .toNumber();
      // orderPrice = testPrice;
      // console.log('testPrice', testPrice);
      orderPrice = poolAmountA.dividedBy(poolAmountB);
      orderPrice = orderPrice.multipliedBy(1.03).toNumber();
    }

    if (orderPrice && orderPrice !== Infinity) {
      // console.log('orderPrice', orderPrice);
      setSwapPrice(orderPrice);
    }
  }, [tokens, tokenA, tokenB, tokenAPoolAmount, tokenBPoolAmount, tokenAAmount]);

  // useEffect(() => {
  //   const poolAmountA = new BigNumber(
  //     getCoinDecimals(Number(tokenAPoolAmount), tokenA)
  //   );
  //   const poolAmountB = new BigNumber(
  //     getCoinDecimals(Number(tokenBPoolAmount), tokenB)
  //   );

  //   let decimals = 0;
  //   if (tokenB.length > 0) {
  //     decimals = getDecimals(tokenB);
  //   }
  //   if (tokenAAmount.length > 0) {
  //     const amount = new BigNumber(Number(tokenAAmount));
  //     const amount2 = amount.multipliedBy(2);
  //     const poolFee = new BigNumber(1).minus(0.003);

  //     const firstamount = poolAmountB
  //       .multipliedBy(poolFee)
  //       .multipliedBy(amount);
  //     const secondamount = poolAmountA.plus(amount2);

  //     const target = firstamount
  //       .dividedBy(secondamount)
  //       .dp(decimals, BigNumber.ROUND_FLOOR)
  //       .toString();
  //     setTokenBAmount(target);
  //     // console.log('target', target);
  //   }
  // }, [tokenA, tokenB, tokenAPoolAmount, tokenBPoolAmount, tokenAAmount]);

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
        }
      }
    };
    getAmountPool();
  }, [jsCyber, tokenA, tokenB, selectedPool, update]);

  useEffect(() => {
    setSelectedPool([]);
    if (poolsData && poolsData.length > 0) {
      if (tokenA.length > 0 && tokenB.length > 0) {
        const arrangedReserveCoinDenoms = sortReserveCoinDenoms(tokenA, tokenB);

        poolsData.forEach((item) => {
          if (
            JSON.stringify(item.reserve_coin_denoms) ===
            JSON.stringify(arrangedReserveCoinDenoms)
          ) {
            // console.log('ggggggggggggggggggggggggg',item);
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

      console.log('dddddddddpoolTokenData',poolTokenData);

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

  const checkInactiveFunc = (token) => {
    if (token.includes('ibc')) {
      //@TODO
      // if (!Object.prototype.hasOwnProperty.call(coinDecimalsConfig, token)) {
      //   return false;
      // }
    }
    return true;
  };

  function getMyTokenBalanceNumber(denom, indexer) {
    return Number(getMyTokenBalance(denom, indexer).split(':')[1].trim());
  }

  useEffect(() => {
    let exceeded = true;
    const validTokenA = checkInactiveFunc(tokenA);
    const validTokenB = checkInactiveFunc(tokenB);
    const myATokenBalance = getMyTokenBalanceNumber(tokenA, accountBalances);

    if (validTokenA && validTokenB) {
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

        if (
          reduceAmounToken(Number(tokenAAmount), tokenA, true) > myATokenBalance
        ) {
          exceeded = true;
        }

        if (swapPrice === 0) {
          exceeded = true;
        }
      }
    } else {
      exceeded = true;
    }
    setIsExceeded(exceeded);
  }, [accountBalances, tokenA, tokenB, selectedTab, tokenAAmount, swapPrice]);

  // useEffect(() => {
  //   const myATokenBalance = getMyTokenBalanceNumber(tokenA, accountBalances);
  //   let exceeded = false;

  //   if (Number(tokenAAmount) > myATokenBalance) {
  //     exceeded = true;
  //   }

  //   setIsExceeded(exceeded);
  // }, [tokenA, tokenAAmount]);

  const getDecimals = (denom) => {
    let decimals = 0;
    if (tokens[denom.toUpperCase()] && tokens[denom]) {
      decimals = parseInt(tokens[denom].denom);
    }

    return decimals;
  };

  useEffect(() => {

    // tokens
    let counterPairAmount = '';
    let decimals = 0;
    if (tokens && tokenB.length > 0 && typeof tokens[tokenB] !=='undefined') {

      decimals = parseInt(tokens[tokenB].denom)
    }


    if (swapPrice && swapPrice !== Infinity && tokenAAmount.length > 0) {

      if ([tokenA, tokenB].sort()[0] === tokenA) {
        const x1 = new BigNumber(1);
        const price = x1.dividedBy(swapPrice);
        counterPairAmount = price
          .multipliedBy(Number(tokenAAmount))
          .dp(decimals, BigNumber.ROUND_FLOOR)
          .toString();
      } else {
        const price = new BigNumber(swapPrice);

        counterPairAmount = price
          .multipliedBy(Number(tokenAAmount))
          .dp(decimals, BigNumber.ROUND_FLOOR)
          .toString();
      }
    }
    setTokenBAmount(counterPairAmount);

    // setTokenBAmount(numberString(counterPairAmount));
  }, [tokenAAmount, tokenA, tokenB, swapPrice]);

  function amountChangeHandler(e) {
    const inputAmount = e.target.value;
    // const retVal = replaceFunc(inputAmount);
    // if (/^[\d]*\.?[\d]{0,3}$/.test(retVal)) {
    if (/^[\d]*\.?[\d]{0,3}$/.test(inputAmount)) {
      // setTokenAAmount(numberString(retVal));
      setTokenAAmount(inputAmount);
    }
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

  const calculateSlippage = (amount, maxSlippage, options = {}) => {
    const value = new BigNumber(amount);
    const slippage = 1 - maxSlippage / 100;
    const result = value.multipliedBy(Math.pow(slippage, options.factor ?? 1)).toFixed(0, BigNumber.ROUND_CEIL);
    return result;
  };

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
    selectedPool,
    selectedTab,
    updateFunc,
    selectMyPool,
    myPools,
    amountPoolCoin,
    isExceeded,
    tokenAPoolAmount,
    tokenBPoolAmount,
    typeTxs,
    ibcClient,
    sourceChannel,
    denomIbc,
    networkB,
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
    networkA,
    setNetworkA,
    networkB,
    setNetworkB,
    typeTxs,
    denomIbc,
    balanceIbc,
    setPercentageBalanceHook,
    networks,
    tokens,
    addressActive,
    calculateSlippage,
    selectedPool,
  };

  const stateWithdraw = {
    accountBalances,
    myPools,
    selectMyPool,
    setSelectMyPool,
    amountPoolCoin,
    onChangeInputWithdraw,
    networks,
    tokens,
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


        {/* <div>{JSON.stringify(poolsData)}</div> */}
        {/* <div>{JSON.stringify(totalSupply)}</div> */}

        {/* { <PoolsList */}
        {/*   poolsData={poolsData} */}
        {/*   accountBalances={accountBalances} */}
        {/*   totalSupply={totalSupply} */}
        {/*   selectedTab={selectedTab} */}
        {/* />} */}
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
