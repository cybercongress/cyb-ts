import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { connect } from 'react-redux';
import { useLocation, useHistory, Route } from 'react-router-dom';
import { Pane } from '@cybercongress/gravity';
import useSWR from 'swr';
import BigNumber from 'bignumber.js';
import queryString from 'query-string';
import { AppContext } from '../../context';
import { CYBER, DEFAULT_GAS_LIMITS } from '../../utils/config';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import {
  reduceBalances,
  formatNumber,
  roundNumber,
  exponentialToDecimal,
  getDisplayAmountReverce,
  findDenomInTokenList,
  isNative,
} from '../../utils/utils';
import { Dots, ValueImg, ButtonIcon } from '../../components';
import {
  calculateCounterPairAmount,
  calculateSlippage,
  sortReserveCoinDenoms,
  getMyTokenBalance,
  reduceAmounToken,
  getPoolToken,
  getCoinDecimals,
  networkList,
} from './utils';
import { TabList } from './components';
import ActionBar from './actionBar';
import PoolsList from './poolsList';
import { useGetParams, usePoolListInterval } from './hooks/useGetPools';
import getBalances from './hooks/getBalances';
import Swap from './swap';
import Withdraw from './withdraw';
import PoolData from './poolData';
import coinDecimalsConfig from '../../utils/configToken';
import useSetupIbcClient from './hooks/useSetupIbcClient';
import networks from '../../utils/networkListIbc';
import Carousel from '../portal/gift/carousel1/Carousel';
import { MainContainer } from '../portal/components';
import useGetSelectTab from './hooks/useGetSelectTab';
// import TracerTx from './tx/TracerTx';
// import TraceTxTable from './components/ibc-history/traceTxTable';
// import HistoryContextProvider from './components/ibc-history/historyContext';

const tokenADefaultValue = CYBER.DENOM_CYBER;
const tokenBDefaultValue = CYBER.DENOM_LIQUID_TOKEN;

// const txHash =
//   'E15BC5F5B62696F5D08C0860CDA13D39E385BD6245595EB07899954336760C8C';

const defaultTokenList = {
  [CYBER.DENOM_CYBER]: 0,
  [CYBER.DENOM_LIQUID_TOKEN]: 0,
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

const itemsStep = [
  {
    title: 'add liquidity',
  },
  {
    title: 'create pool',
  },
  {
    title: 'sub liquidity',
  },
];

const checkInactiveFunc = (token, ibcDataDenom) => {
  if (token.includes('ibc')) {
    if (!Object.prototype.hasOwnProperty.call(ibcDataDenom, token)) {
      return false;
    }
  }
  return true;
};

function getMyTokenBalanceNumber(denom, indexer) {
  return Number(getMyTokenBalance(denom, indexer).split(':')[1].trim());
}

function addPunctuationToNumbers(number) {
  return number.replace(/(\d{3})(?=\d)/g, '$1 ');
}

function Teleport({ defaultAccount }) {
  const { jsCyber, keplr, ibcDataDenom, traseDenom } = useContext(AppContext);
  const history = useHistory();
  const { selectedTab } = useGetSelectTab(history);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [update, setUpdate] = useState(0);
  const { liquidBalances: accountBalances } = getBalances(
    addressActive,
    update
  );
  const { params } = useGetParams();
  const { poolsData } = usePoolListInterval();
  const [tokenA, setTokenA] = useState(tokenADefaultValue);
  const [tokenB, setTokenB] = useState(tokenBDefaultValue);
  const [tokenAAmount, setTokenAAmount] = useState('');
  const [tokenBAmount, setTokenBAmount] = useState('');
  const [tokenAPoolAmount, setTokenAPoolAmount] = useState(0);
  const [tokenBPoolAmount, setTokenBPoolAmount] = useState(0);
  const [selectedPool, setSelectedPool] = useState([]);
  const [swapPrice, setSwapPrice] = useState(0);
  const [totalSupply, setTotalSupply] = useState(null);
  const [totalSupplyFull, setTotalSupplyFull] = useState(null);
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

  // TO-DO Tracer status ibc txs
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
    if (selectedTab === 'swap') {
      const dataLocalStorageNetworkA = localStorage.getItem('networkA');
      const dataLocalStorageNetworkB = localStorage.getItem('networkB');
      if (dataLocalStorageNetworkA !== null) {
        setNetworkA(dataLocalStorageNetworkA);
      }
      if (dataLocalStorageNetworkB !== null) {
        setNetworkB(dataLocalStorageNetworkB);
      }
    } else {
      setNetworkA(CYBER.CHAIN_ID);
      setNetworkB(CYBER.CHAIN_ID);
    }
  }, [selectedTab]);

  useEffect(() => {
    if (networkA === CYBER.CHAIN_ID && networkB === CYBER.CHAIN_ID) {
      setTypeTxs('swap');
    }

    if (networkA !== CYBER.CHAIN_ID && networkB === CYBER.CHAIN_ID) {
      setTypeTxs('deposit');
      const { sourceChannelId } = networks[networkA];
      setSourceChannel(sourceChannelId);
    }

    if (networkA === CYBER.CHAIN_ID && networkB !== CYBER.CHAIN_ID) {
      setTypeTxs('withdraw');
      const { destChannelId } = networks[networkB];
      setSourceChannel(destChannelId);
    }
  }, [networkB, networkA]);

  useEffect(() => {
    const getTotalSupply = async () => {
      if (jsCyber !== null) {
        const responseTotalSupply = await jsCyber.totalSupply();

        const datareduceTotalSupply = reduceBalances(responseTotalSupply);

        if (Object.keys(datareduceTotalSupply).length > 0) {
          setTotalSupplyFull(datareduceTotalSupply);
        }

        const reduceData = {};

        if (Object.keys(ibcDataDenom).length > 0) {
          Object.keys(datareduceTotalSupply).forEach((key) => {
            const value = datareduceTotalSupply[key];
            if (!isNative(key)) {
              if (Object.prototype.hasOwnProperty.call(ibcDataDenom, key)) {
                const { baseDenom, sourceChannelId: sourceChannelIFromPath } =
                  ibcDataDenom[key];
                const denomInfoFromList = findDenomInTokenList(baseDenom);
                if (denomInfoFromList !== null) {
                  if (
                    Object.prototype.hasOwnProperty.call(
                      denomInfoFromList,
                      'destChannelId'
                    )
                  ) {
                    const { destChannelId } = denomInfoFromList;
                    if (destChannelId === sourceChannelIFromPath) {
                      reduceData[key] = value;
                    }
                  }
                }
              }
            } else if (key.indexOf('pool') !== 0) {
              reduceData[key] = value;
            }
          });
        }

        if (Object.keys(reduceData).length > 0) {
          setTotalSupply({ ...defaultTokenList, ...reduceData });
        } else {
          setTotalSupply({ ...defaultTokenList, ...datareduceTotalSupply });
        }
      }
    };
    getTotalSupply();
  }, [jsCyber, ibcDataDenom]);

  useEffect(() => {
    let orderPrice = 0;
    setSwapPrice(0);

    const poolAmountA = new BigNumber(
      getCoinDecimals(Number(tokenAPoolAmount), tokenA)
    );
    const poolAmountB = new BigNumber(
      getCoinDecimals(Number(tokenBPoolAmount), tokenB)
    );

    if (poolAmountA.comparedTo(0) > 0 && poolAmountB.comparedTo(0) > 0) {
      if ([tokenA, tokenB].sort()[0] !== tokenA) {
        orderPrice = poolAmountB.dividedBy(poolAmountA);
        orderPrice = orderPrice.multipliedBy(0.97).toNumber();
      } else {
        orderPrice = poolAmountA.dividedBy(poolAmountB);
        orderPrice = orderPrice.multipliedBy(1.03).toNumber();
      }
    }

    if (orderPrice && orderPrice !== Infinity) {
      setSwapPrice(orderPrice);
    }
  }, [tokenA, tokenB, tokenAPoolAmount, tokenBPoolAmount, tokenAAmount]);

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
    const checkTokenA = checkInactiveFunc(tokenA, ibcDataDenom);
    const checkTokenB = checkInactiveFunc(tokenB, ibcDataDenom);
    const myATokenBalance = getMyTokenBalanceNumber(tokenA, accountBalances);
    const myATokenBalanceB = getMyTokenBalanceNumber(tokenB, accountBalances);

    if (checkTokenA && checkTokenB) {
      if (accountBalances !== null) {
        const validTokenA = Object.prototype.hasOwnProperty.call(
          accountBalances,
          tokenA
        );
        const { coinDecimals: coinDecimalsA } = traseDenom(tokenA);
        const { coinDecimals: coinDecimalsB } = traseDenom(tokenB);

        const validTokenAmountA =
          getDisplayAmountReverce(tokenAAmount, coinDecimalsA) <=
            myATokenBalance && Number(tokenAAmount) > 0;

        const resultValidTokenA = validTokenAmountA && validTokenA;

        const validTokensAB =
          Object.prototype.hasOwnProperty.call(accountBalances, tokenA) &&
          Object.prototype.hasOwnProperty.call(accountBalances, tokenB) &&
          accountBalances[tokenA] > 0 &&
          accountBalances[tokenB] > 0;

        const validTokenAmountAB =
          getDisplayAmountReverce(tokenAAmount, coinDecimalsA) <=
            myATokenBalance &&
          Number(tokenAAmount) > 0 &&
          getDisplayAmountReverce(tokenBAmount, coinDecimalsB) <=
            myATokenBalanceB &&
          Number(tokenBAmount) > 0;

        const resultValidSelectTokens = validTokensAB && validTokenAmountAB;

        if (selectedTab === 'swap' && swapPrice !== 0 && resultValidTokenA) {
          exceeded = false;
        }

        if (
          selectedTab === 'add-liquidity' &&
          resultValidSelectTokens &&
          swapPrice !== 0
        ) {
          exceeded = false;
        }

        if (selectedTab === 'createPool' && resultValidSelectTokens) {
          exceeded = false;
        }
      }
    }
    setIsExceeded(exceeded);
  }, [
    accountBalances,
    tokenA,
    tokenB,
    selectedTab,
    tokenAAmount,
    tokenBAmount,
    swapPrice,
    ibcDataDenom,
  ]);

  const amountChangeHandler = useCallback(
    (values, e) => {
      const inputAmount = values;

      const isReverse = e.target.id !== 'tokenAAmount';

      // if (/^[\d]*\.?[\d]{0,3}$/.test(inputAmount)) {
      const state = { tokenAPoolAmount, tokenBPoolAmount, tokenB, tokenA };

      let { counterPairAmount } = calculateCounterPairAmount(
        inputAmount,
        e,
        state
      );
      counterPairAmount = Math.abs(Number(counterPairAmount).toFixed(4));
      if (isReverse) {
        setTokenBAmount(new BigNumber(inputAmount).toNumber());
        setTokenAAmount(counterPairAmount);
      } else {
        setTokenAAmount(new BigNumber(inputAmount).toNumber());
        setTokenBAmount(counterPairAmount);
      }
      // }
    },
    [tokenAPoolAmount, tokenBPoolAmount, tokenB, tokenA]
  );

  const amountChangeHandlerCreatePool = useCallback((values, e) => {
    const inputAmount = values;

    const isReverse = e.target.id !== 'tokenAAmount';

    // if (/^[\d]*\.?[\d]{0,3}$/.test(inputAmount)) {
    if (isReverse) {
      setTokenBAmount(new BigNumber(inputAmount).toNumber());
    } else {
      setTokenAAmount(new BigNumber(inputAmount).toNumber());
    }
    // }
  }, []);

  const onChangeInputWithdraw = (values, e) => {
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

  const onChangeSelectNetworksA = (item) => {
    localStorage.setItem('networkA', item);
    setNetworkA(item);
  };

  const onChangeSelectNetworksB = (item) => {
    localStorage.setItem('networkB', item);
    setNetworkB(item);
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
    onChangeSelectNetworksA,
    onChangeSelectNetworksB,
    networkB,
    setNetworkB,
    typeTxs,
    denomIbc,
    balanceIbc,
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
        render={() => (
          <Swap
            swap
            stateSwap={stateSwap}
            amountChangeHandler={amountChangeHandler}
            marginTop={42}
          />
        )}
      />
    );
  }

  if (selectedTab === 'add-liquidity') {
    content = (
      <Route
        path="/warp/add-liquidity"
        render={() => (
          <Swap
            stateSwap={stateSwap}
            amountChangeHandler={amountChangeHandler}
          />
        )}
      />
    );
  }

  if (selectedTab === 'createPool') {
    content = (
      <Route
        path="/warp/create-pool"
        render={() => (
          <Swap
            stateSwap={stateSwap}
            amountChangeHandler={amountChangeHandlerCreatePool}
          />
        )}
      />
    );
  }

  if (selectedTab === 'sub-liquidity') {
    content = (
      <Route
        path="/warp/sub-liquidity"
        render={() => <Withdraw stateSwap={stateWithdraw} />}
      />
    );
  }

  if (selectedTab === 'pools') {
    content = (
      <Route
        path="/warp/pools"
        render={() => (
          <PoolData
            data={poolsData}
            totalSupplyData={totalSupplyFull}
            accountBalances={accountBalances}
          />
        )}
      />
    );
  }

  return (
    <>
      <MainContainer>
        {selectedTab !== 'pools' && selectedTab !== 'swap' && (
          // <Carousel
          //   slides={itemsStep}
          //   activeStep={Math.floor(appStep)}
          //   setStep={setStepApp}
          //   disableNext={false}
          //   infinity
          // />
          <TabList selected={selectedTab} />
        )}

        <Pane
          width="100%"
          display="flex"
          alignItems="center"
          flexDirection="column"
          // height="84vh"
        >
          {content}
        </Pane>

        {/* <TraceTxTable /> */}
      </MainContainer>
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
