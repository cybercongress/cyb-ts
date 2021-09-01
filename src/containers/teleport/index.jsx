import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Pane, ActionBar, Input } from '@cybercongress/gravity';
import { coins, coin } from '@cosmjs/launchpad';
import { AppContext } from '../../context';
import { CYBER, DEFAULT_GAS_LIMITS } from '../../utils/config';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import { reduceBalances, formatNumber, coinDecimals } from '../../utils/utils';
import { Dots, ValueImg } from '../../components';

const POOL_TYPE_INDEX = 1;

const Select = ({ data, selected, valueSelect, onChangeSelect }) => {
  let items = {};

  if (data === null) {
    items = (
      <option value="">
        <Dots />
      </option>
    );
  } else {
    items = (
      <>
        <option value="">pick token</option>
        {Object.keys(data)
          .filter((item) => item.indexOf('pool') === -1 && item !== selected)
          .map((key) => (
            <option
              key={key}
              value={key}
              // style={{
              //   backgroundImage: `url(${tokenImg(key)})`,
              // }}
            >
              {key}
            </option>
          ))}
      </>
    );
  }

  return (
    <select
      style={{
        width: '120px',
      }}
      value={valueSelect}
      onChange={onChangeSelect}
    >
      {items}
    </select>
  );
};

const BalanceToken = ({ token, data }) => {
  let balance = 0;

  if (data === null) {
    balance = <Dots />;
  } else if (data[token]) {
    balance = formatNumber(data[token]);
  } else {
    balance = 0;
  }

  return (
    <Pane
      display="flex"
      alignItems="center"
      color="#777777"
      fontSize="18px"
      width="100%"
      justifyContent="space-between"
    >
      <Pane>Available</Pane>
      <Pane>{balance}</Pane>
    </Pane>
  );
};

const PoolTokenAmount = ({ addressPool, token }) => {
  const { jsCyber } = useContext(AppContext);
  const [amounToken, setAmounToken] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBalances = async () => {
      setLoading(true);
      if (jsCyber !== null) {
        const getBalancePromise = await jsCyber.getBalance(addressPool, token);
        setAmounToken(parseFloat(getBalancePromise.amount));
        setLoading(false);
      }
    };
    getBalances();
  }, [jsCyber, addressPool, token]);

  return <Pane>{loading ? <Dots /> : formatNumber(amounToken)}</Pane>;
};

const PoolItemsList = ({ addressPool, token }) => (
  <Pane
    display="flex"
    alignItems="center"
    justifyContent="space-between"
    marginBottom={10}
  >
    <ValueImg
      style={{
        flexDirection: 'row-reverse',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      text={token}
      marginImg="0 5px"
    />
    <PoolTokenAmount addressPool={addressPool} token={token} />
  </Pane>
);

function sortReserveCoinDenoms(x, y) {
  return [x, y].sort();
}

function Teleport({ defaultAccount }) {
  const { keplr, jsCyber } = useContext(AppContext);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [accountBalances, setAccountBalances] = useState(null);
  const [tokenA, setTokenA] = useState('');
  const [tokenB, setTokenB] = useState('');
  const [tokenAAmount, setTokenAAmount] = useState('');
  const [tokenBAmount, setTokenBAmount] = useState('');
  const [tokenAPoolAmount, setTokenAPoolAmount] = useState(0);
  const [tokenBPoolAmount, setTokenBPoolAmount] = useState(0);
  const [poolsData, setPoolsData] = useState([]);
  const [selectedPool, setSelectedPool] = useState([]);
  const [params, setParams] = useState(null);
  const [swapPrice, setSwapPrice] = useState(0);

  const fee = {
    amount: [],
    gas: DEFAULT_GAS_LIMITS.toString(),
  };

  useEffect(() => {
    const getPools = async () => {
      if (jsCyber !== null) {
        const response = await jsCyber.pools();

        console.log(`pools`, response);

        if (response.pools) {
          setPoolsData(response.pools);
        }

        // const responsePool = await jsCyber.pool(1);
        // console.log(`responsePool`, responsePool);
      }
    };
    getPools();
  }, [jsCyber]);

  useEffect(() => {
    const getLiquidityParams = async () => {
      if (jsCyber !== null) {
        const responseLiquidityParams = await jsCyber.liquidityParams();

        console.log(`responseLiquidityParams`, responseLiquidityParams);
        setParams(responseLiquidityParams.params);
      }
    };
    getLiquidityParams();
  }, [jsCyber]);

  useEffect(() => {
    const getBalances = async () => {
      if (jsCyber !== null && addressActive !== null && addressActive.bech32) {
        const getAllBalancesPromise = await jsCyber.getAllBalances(
          addressActive.bech32
        );

        const data = reduceBalances(getAllBalancesPromise);
        console.log(`reduceBalances`, data);
        setAccountBalances(data);
      }
    };
    getBalances();
  }, [jsCyber, addressActive]);

  useEffect(() => {
    const price = tokenBPoolAmount / tokenAPoolAmount;
    if (price && price !== Infinity) {
      setSwapPrice(price);
    }
  }, [tokenAPoolAmount, tokenBPoolAmount]);

  const createPool = async () => {
    const [{ address }] = await keplr.signer.getAccounts();

    const depositCoins = [
      coin(1000000, CYBER.DENOM_CYBER),
      coin(1000000, 'mamper'),
    ];
    console.log(`depositCoins`, depositCoins);

    const response = await keplr.createPool(
      address,
      POOL_TYPE_INDEX,
      depositCoins,
      fee
    );

    console.log(`response`, response);
  };

  const withdwawWithinBatch = async () => {
    const [{ address }] = await keplr.signer.getAccounts();

    const depositCoins = coins(10000, CYBER.DENOM_CYBER);
    console.log(`depositCoins`, depositCoins);

    const response = await keplr.withdwawWithinBatch(
      address,
      1,
      depositCoins,
      fee
    );

    console.log(`response`, response);
  };

  const depositWithinBatch = async () => {
    const [{ address }] = await keplr.signer.getAccounts();

    const depositCoins = [
      coin(1000, CYBER.DENOM_CYBER),
      coin(1000, 'hydrogen'),
    ];

    const response = await keplr.depositWithinBatch(
      address,
      1,
      depositCoins,
      fee
    );

    console.log(`response`, response);
  };

  const swapWithinBatch = async () => {
    const [{ address }] = await keplr.signer.getAccounts();
    // params;
    // poolsData;

    const offerCoinFee = coin(
      Math.floor(
        parseFloat(tokenAAmount) *
          coinDecimals(parseFloat(params.swapFeeRate)) *
          0.5
      ),
      tokenA
    );
    // const offerCoinFee = coin(0, tokenA);

    const offerCoin = coin(parseFloat(tokenAAmount), tokenA);

    const demandCoinDenom = tokenB;

    const response = await keplr.swapWithinBatch(
      address,
      parseFloat(selectedPool.id),
      POOL_TYPE_INDEX,
      offerCoin,
      demandCoinDenom,
      offerCoinFee,
      (swapPrice * 10 ** 18).toString(),
      fee
    );

    console.log(`response`, response);
  };

  useEffect(() => {
    const getAmountPool = async () => {
      setTokenAPoolAmount(0);
      setTokenBPoolAmount(0);
      if (jsCyber !== null && Object.keys(selectedPool).length > 0) {
        const getAllBalancesPromise = await jsCyber.getAllBalances(
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
  }, [jsCyber, tokenA, tokenB, selectedPool]);

  useEffect(() => {
    setSelectedPool([]);
    if (poolsData.length > 0) {
      if (tokenA.length > 0 && tokenB.length > 0) {
        const arrangedReserveCoinDenoms = sortReserveCoinDenoms(tokenA, tokenB);
        poolsData.forEach((item) => {
          if (
            JSON.stringify(item.reserveCoinDenoms) ===
            JSON.stringify(arrangedReserveCoinDenoms)
          ) {
            setSelectedPool(item);
          }
        });
      }
    }
  }, [poolsData, tokenA, tokenB]);

  console.log(`swapPrice`, tokenAAmount * swapPrice);

  return (
    <>
      <main className="block-body">
        <Pane display="flex" alignItems="center" flexDirection="column">
          <Pane>
            <BalanceToken data={accountBalances} token={tokenA} />
            <Pane display="flex" alignItems="center" marginBottom={50}>
              <Pane fontSize="18px">Sell</Pane>
              <Select
                data={accountBalances}
                valueSelect={tokenA}
                selected={tokenB}
                onChangeSelect={(e) => setTokenA(e.target.value)}
              />
              <Input
                value={tokenAAmount}
                onChange={(e) => setTokenAAmount(e.target.value)}
                placeholder="amount"
                width="200px"
                height={42}
                fontSize="20px"
                textAlign="end"
              />
            </Pane>
          </Pane>

          <Pane>
            <BalanceToken data={accountBalances} token={tokenB} />
            <Pane display="flex" alignItems="center">
              <Pane fontSize="18px">Buy</Pane>
              <Select
                data={accountBalances}
                valueSelect={tokenB}
                selected={tokenA}
                onChangeSelect={(e) => setTokenB(e.target.value)}
              />
              <Input
                value={tokenBAmount}
                onChange={(e) => setTokenBAmount(e.target.value)}
                placeholder="amount"
                width="200px"
                height={42}
                fontSize="20px"
                textAlign="end"
              />
            </Pane>
          </Pane>
        </Pane>
        <Pane marginBottom={20} marginTop={50} fontSize="18px">
          Pools:
        </Pane>
        {poolsData.length > 0 &&
          poolsData.map((item) => (
            <Pane
              width="100%"
              display="flex"
              flexDirection="column"
              borderBottom="1px solid #979797"
            >
              <Pane display="flex" alignItems="center" marginBottom={10}>
                <ValueImg text={item.reserveCoinDenoms[0]} onlyImg />
                <ValueImg text={item.reserveCoinDenoms[1]} onlyImg />

                <Pane marginLeft={10} fontSize="18px">
                  <ValueImg text={item.reserveCoinDenoms[0]} onlyText /> -{' '}
                  <ValueImg text={item.reserveCoinDenoms[1]} onlyText />
                </Pane>
              </Pane>
              <PoolItemsList
                addressPool={item.reserveAccountAddress}
                token={item.reserveCoinDenoms[0]}
              />
              <PoolItemsList
                addressPool={item.reserveAccountAddress}
                token={item.reserveCoinDenoms[1]}
              />
            </Pane>
          ))}
      </main>
      {keplr !== null && (
        <ActionBar>
          <Pane display="flex" width="100%" justifyContent="space-evenly">
            <Button onClick={() => createPool()}>createPool</Button>
            <Button onClick={() => withdwawWithinBatch()}>withdwawBatch</Button>
            <Button onClick={() => depositWithinBatch()}>depositInBatch</Button>
            <Button onClick={() => swapWithinBatch()}>swap</Button>
          </Pane>
        </ActionBar>
      )}
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
