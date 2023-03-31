import { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { connect } from 'react-redux';
import {
  useParams,
  createSearchParams,
  useSearchParams,
} from 'react-router-dom';
import { Pane } from '@cybercongress/gravity';
import BigNumber from 'bignumber.js';
import useGetTotalSupply from 'src/hooks/useGetTotalSupply';
import { AppContext } from '../../context';
import { CYBER } from '../../utils/config';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import { reduceBalances, getDisplayAmountReverce } from '../../utils/utils';
import {
  calculateCounterPairAmount,
  sortReserveCoinDenoms,
  getMyTokenBalance,
  getPoolToken,
  getCoinDecimals,
} from './utils';
import { TabList } from './components';
import ActionBar from './actionBar';
import { useGetParams, usePoolListInterval } from './hooks/useGetPools';
import getBalances from './hooks/getBalances';
import useSetupIbcClient from './hooks/useSetupIbcClient';
import networks from '../../utils/networkListIbc';
import { MainContainer } from '../portal/components';
import Swap from './swap';
import Withdraw from './withdraw';
// import TracerTx from './tx/TracerTx';
// import TraceTxTable from './components/ibc-history/traceTxTable';
// import HistoryContextProvider from './components/ibc-history/historyContext';

const tokenADefaultValue = CYBER.DENOM_CYBER;
const tokenBDefaultValue = CYBER.DENOM_LIQUID_TOKEN;

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

function Teleport({ defaultAccount }) {
  const { jsCyber, keplr, ibcDataDenom, traseDenom } = useContext(AppContext);
  const { tab = 'swap' } = useParams();
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [searchParams, setSearchParams] = useSearchParams();
  const [update, setUpdate] = useState(0);
  const { liquidBalances: accountBalances } = getBalances(
    addressActive,
    update
  );
  const { params } = useGetParams();
  const { totalSupplyProofList: totalSupply } = useGetTotalSupply();
  const { poolsData } = usePoolListInterval();
  const [tokenA, setTokenA] = useState(tokenADefaultValue);
  const [tokenB, setTokenB] = useState(tokenBDefaultValue);
  const [tokenAAmount, setTokenAAmount] = useState('');
  const [tokenBAmount, setTokenBAmount] = useState('');
  const [tokenAPoolAmount, setTokenAPoolAmount] = useState(0);
  const [tokenBPoolAmount, setTokenBPoolAmount] = useState(0);
  const [selectedPool, setSelectedPool] = useState([]);
  const [swapPrice, setSwapPrice] = useState(0);
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
    if (tab === 'swap') {
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
  }, [tab]);

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

        if (tab === 'swap' && swapPrice !== 0 && resultValidTokenA) {
          exceeded = false;
        }

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
    tab,
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

  return (
    <>
      <MainContainer width="62%">
        {tab !== 'swap' && <TabList selected={tab} />}

        <Pane
          width="100%"
          display="flex"
          alignItems="center"
          flexDirection="column"
        >
          {tab === 'swap' && (
            <Swap
              swap
              stateSwap={stateSwap}
              amountChangeHandler={amountChangeHandler}
              marginTop={42}
            />
          )}
          {tab === 'add-liquidity' && (
            <Swap
              stateSwap={stateSwap}
              amountChangeHandler={amountChangeHandler}
            />
          )}
          {tab === 'create-pool' && (
            <Swap
              stateSwap={stateSwap}
              amountChangeHandler={amountChangeHandlerCreatePool}
            />
          )}
          {tab === 'sub-liquidity' && <Withdraw stateSwap={stateWithdraw} />}
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
