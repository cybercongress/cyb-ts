import {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
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
  networkList,
} from './utils';
import { TabList } from './components';
import ActionBar from './actionBar.new';
import { useGetParams, usePoolListInterval } from './hooks/useGetPoolsTs.new';
import getBalances from './hooks/getBalances';
import useSetupIbcClient from './hooks/useSetupIbcClient';
import networks from '../../utils/networkListIbc';
import { InputNumber, MainContainer } from 'src/components';
import TokenSetter from './components/tokenSetter.new';
import NetworkSetter from './components/networkSetter';
import useSdk from 'src/hooks/useSdk';
import { Pool } from '@cybercongress/cyber-js/build/codec/tendermint/liquidity/v1beta1/liquidity';
import imgSwap from 'images/exchange-arrows.svg';
import { ButtonIcon } from './components/slider';

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

function useGetSwapPrice(
  tokenA: string,
  tokenB: string,
  tokenAPoolAmount: number,
  tokenBPoolAmount: number
): number {
  const [swapPrice, setSwapPrice] = useState<number>(0);

  useEffect(() => {
    let orderPrice = new BigNumber(0);
    setSwapPrice(0);

    const poolAmountA = new BigNumber(
      getCoinDecimals(tokenAPoolAmount, tokenA)
    );
    const poolAmountB = new BigNumber(
      getCoinDecimals(tokenBPoolAmount, tokenB)
    );

    if (poolAmountA.comparedTo(0) > 0 && poolAmountB.comparedTo(0) > 0) {
      if ([tokenA, tokenB].sort()[0] !== tokenA) {
        orderPrice = poolAmountB.dividedBy(poolAmountA);
        orderPrice = orderPrice.multipliedBy(0.97);
      } else {
        orderPrice = poolAmountA.dividedBy(poolAmountB);
        orderPrice = orderPrice.multipliedBy(1.03);
      }
    }

    setSwapPrice(orderPrice.toNumber());
  }, [tokenA, tokenB, tokenAPoolAmount, tokenBPoolAmount]);

  return swapPrice;
}

type TypeTxsT = 'swap' | 'deposit' | 'withdraw';

function Teleport({ defaultAccount }) {
  const { queryClient } = useSdk();
  const { keplr, ibcDataDenom, traseDenom } = useContext(AppContext);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [searchParams, setSearchParams] = useSearchParams();
  const [update, setUpdate] = useState(0);
  const { liquidBalances: accountBalances } = getBalances(
    addressActive,
    update
  );
  const params = useGetParams();
  const { totalSupplyProofList: totalSupply } = useGetTotalSupply();
  const poolsData = usePoolListInterval();

  const [tokenA, setTokenA] = useState<string>(tokenADefaultValue);
  const [tokenB, setTokenB] = useState<string>(tokenBDefaultValue);
  const [tokenAAmount, setTokenAAmount] = useState<string | number>('');
  const [tokenBAmount, setTokenBAmount] = useState<string | number>('');
  const [tokenAPoolAmount, setTokenAPoolAmount] = useState<number>(0);
  const [tokenBPoolAmount, setTokenBPoolAmount] = useState<number>(0);
  const [selectedPool, setSelectedPool] = useState<Pool | undefined>(undefined);
  const [isExceeded, setIsExceeded] = useState<boolean>(false);
  const [networkA, setNetworkA] = useState<string>(CYBER.CHAIN_ID);
  const [networkB, setNetworkB] = useState<string>(CYBER.CHAIN_ID);
  const [typeTxs, setTypeTxs] = useState<TypeTxsT>('swap');
  const [sourceChannel, setSourceChannel] = useState<string | null>(null);

  const { ibcClient, balanceIbc, denomIbc } = useSetupIbcClient(
    tokenA,
    networkA,
    keplr
  );
  const swapPrice = useGetSwapPrice(
    tokenA,
    tokenB,
    tokenAPoolAmount,
    tokenBPoolAmount
  );

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
  }, [tokenA, tokenB, setSearchParams, searchParams]);

  useEffect(() => {
    const dataLocalStorageNetworkA = localStorage.getItem('networkA');
    const dataLocalStorageNetworkB = localStorage.getItem('networkB');
    if (dataLocalStorageNetworkA !== null) {
      setNetworkA(dataLocalStorageNetworkA);
    }
    if (dataLocalStorageNetworkB !== null) {
      setNetworkB(dataLocalStorageNetworkB);
    }
  }, []);

  useEffect(() => {
    if (networkA === CYBER.CHAIN_ID && networkB === CYBER.CHAIN_ID) {
      setTypeTxs('swap');
    }

    if (networkA !== CYBER.CHAIN_ID && networkB === CYBER.CHAIN_ID) {
      setTypeTxs('deposit');
      const { sourceChannelId } = networks[networkA];
      setSourceChannel(sourceChannelId);
      setTokenB('');
    }

    if (networkA === CYBER.CHAIN_ID && networkB !== CYBER.CHAIN_ID) {
      setTypeTxs('withdraw');
      const { destChannelId } = networks[networkB];
      setSourceChannel(destChannelId);
      setTokenB('');
    }
  }, [networkB, networkA]);

  useEffect(() => {
    const getAmountPool = async () => {
      setTokenAPoolAmount(0);
      setTokenBPoolAmount(0);

      if (!!queryClient && selectedPool) {
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
    getAmountPool();
  }, [queryClient, tokenA, tokenB, selectedPool, update]);

  useEffect(() => {
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

  // useEffect(() => {
  //   if (accountBalances !== null && poolsData && poolsData !== null) {
  //     const poolTokenData = getPoolToken(poolsData, accountBalances);
  //     let poolTokenDataIndexer = {};

  //     poolTokenDataIndexer = poolTokenData.reduce(
  //       (obj, item) => ({
  //         ...obj,
  //         [item.poolCoinDenom]: item,
  //       }),
  //       {}
  //     );
  //     setMyPools(poolTokenDataIndexer);
  //   }
  // }, [accountBalances, poolsData]);

  useEffect(() => {
    let exceeded = true;
    const checkTokenA = checkInactiveFunc(tokenA, ibcDataDenom);
    const myATokenBalance = getMyTokenBalanceNumber(tokenA, accountBalances);

    if (checkTokenA) {
      if (accountBalances !== null) {
        const validTokenA = Object.prototype.hasOwnProperty.call(
          accountBalances,
          tokenA
        );
        const { coinDecimals: coinDecimalsA } = traseDenom(tokenA);

        const validTokenAmountA =
          parseFloat(getDisplayAmountReverce(tokenAAmount, coinDecimalsA)) <=
            myATokenBalance && Number(tokenAAmount) > 0;

        const resultValidTokenA = validTokenAmountA && validTokenA;

        if (swapPrice !== 0 && resultValidTokenA) {
          exceeded = false;
        }
      }
    }
    setIsExceeded(exceeded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    accountBalances,
    tokenA,
    tokenAAmount,
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
      counterPairAmount = Math.abs(parseFloat(Number(counterPairAmount).toFixed(4)));
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

  const useGetAccountBalancesTokenA = useMemo(() => {
    if (typeTxs === 'deposit') {
      return balanceIbc;
    }

    if (typeTxs === 'swap' || typeTxs === 'withdraw') {
      return accountBalances;
    }

    return null;
  }, [typeTxs, accountBalances, balanceIbc]);

  const useGetDenomTokenA = useMemo(() => {
    if (typeTxs === 'deposit' && denomIbc) {
      return denomIbc;
    }

    return tokenA;
  }, [typeTxs, tokenA, denomIbc]);

  const stateActionBar = {
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
  };

  return (
    <>
      <MainContainer width="52%">
        <Pane
          width="100%"
          display="flex"
          alignItems="center"
          flexDirection="column"
        >
          <TokenSetter
            accountBalances={useGetAccountBalancesTokenA}
            balancesByDenom={useGetDenomTokenA}
            token={tokenA}
            totalSupply={totalSupply}
            selected={tokenB}
            onChangeSelect={setTokenA}
            // textLeft={}
          />
          <NetworkSetter
            selectedNetwork={networkA}
            onChangeSelectNetwork={onChangeSelectNetworksA}
            networks={networkList}
          />
          <InputNumber
            id="tokenAAmount"
            onValueChange={amountChangeHandler}
            value={tokenAAmount}
          />

          <ButtonIcon
            onClick={() => tokenChange()}
            img={imgSwap}
            style={{
              position: 'relative',
              top: 0,
              transform: 'unset',
              left: 0,
            }}
          />

          {typeTxs === 'swap' && (
            <TokenSetter
              accountBalances={accountBalances}
              balancesByDenom={tokenB}
              token={tokenB}
              totalSupply={totalSupply}
              selected={tokenB}
              onChangeSelect={setTokenB}
            />
          )}
          <NetworkSetter
            selectedNetwork={networkB}
            onChangeSelectNetwork={onChangeSelectNetworksB}
            networks={networkList}
          />
          {typeTxs === 'swap' && (
            <InputNumber
              id="tokenBAmount"
              value={tokenBAmount}
              onValueChange={amountChangeHandler}
            />
          )}
        </Pane>

        {/* <TraceTxTable /> */}
      </MainContainer>
      <ActionBar stateActionBar={stateActionBar} />
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
