/* eslint-disable no-restricted-syntax */
import React, {
  useEffect,
  useState,
  useMemo,
  useContext,
  useCallback,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import BigNumber from 'bignumber.js';
import {
  CardStatisics,
  LinkWindow,
  NoItems,
  Denom,
  DenomArr,
} from '../../components';
import {
  convertAmount,
  exponentialToDecimal,
  reduceBalances,
} from '../../utils/utils';
import { PoolItemsList } from './components';
import coinDecimalsConfig from '../../utils/configToken';
import { ContainerGradient, ContainerGradientText } from '../portal/components';
import { AppContext } from '../../context';
import { FormatNumberTokens } from '../nebula/components';
import { CYBER } from '../../utils/config';
import tokenList from '../../utils/tokenList';

const styleContainer = {
  display: 'flex',
  flexDirection: 'column',
  padding: '25px',
  // alignItems: 'center',
  backgroundColor: '#000',
  minWidth: '200px',
  // maxWidth: '500px',
  boxShadow: '0 0 5px #36d6ae',
  borderRadius: '5px',
  position: 'relative',
};

const styleTitleContainer = {
  display: 'flex',
  marginBottom: '20px',
  alignItems: 'center',
};

const styleContainerImg = {
  display: 'flex',
  justifyContent: 'center',
};

const styleTitleDenomContainer = {
  display: 'flex',
  fontWeight: '600',
  fontSize: '18px',
  color: '#fff',
};

const styleAmountPoolContainer = {
  borderBottom: '1px solid #ffffff6e',
};

const styleTitleAmountPoolContainer = {
  fontWeight: '600',
  color: '#ffffffb3',
  marginBottom: '6px',
  display: 'flex',
};

const styleMySharesContainer = {
  marginTop: '10px',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  height: '40px',
};

const inactiveStyle = {
  position: 'absolute',
  right: '0px',
  marginRight: '10px',
  color: 'rgb(255, 145, 0)',
  fontSize: '18px',
  top: '0',
  marginTop: '10px',
};

const TitlePool = ({ pool, useInactive }) => (
  <>
    <div style={{ display: 'flex', gap: '10px' }}>
      <div style={styleContainerImg}>
        <Denom
          size={30}
          denomValue={pool.reserve_coin_denoms[0]}
          onlyImg
          zIndexImg={1}
        />
        <Denom
          size={30}
          denomValue={pool.reserve_coin_denoms[1]}
          onlyImg
          marginContainer="0px 0px 0px -8px"
        />
      </div>
      <div>
        <div
          style={{
            fontSize: '16px',
            color: '#ffffffb3',
            fontWeight: 600,
          }}
        >
          Pool #{pool.id}
        </div>
        <div style={styleTitleDenomContainer}>
          <Denom denomValue={pool.reserve_coin_denoms[0]} onlyText />/
          <Denom denomValue={pool.reserve_coin_denoms[1]} onlyText />
        </div>
      </div>
      {useInactive && <div style={inactiveStyle}>inactive</div>}
    </div>
  </>
);

const PoolCard = ({ pool, totalSupplyData, accountBalances }) => {
  const { traseDenom } = useContext(AppContext);

  const [sharesToken, setSharesToken] = useState(null);

  useEffect(() => {
    setSharesToken(null);
    if (
      totalSupplyData !== null &&
      Object.prototype.hasOwnProperty.call(
        totalSupplyData,
        pool.pool_coin_denom
      ) &&
      accountBalances !== null &&
      Object.prototype.hasOwnProperty.call(
        accountBalances,
        pool.pool_coin_denom
      )
    ) {
      const amountTotal = totalSupplyData[pool.pool_coin_denom];
      const amountAccountBalances = accountBalances[pool.pool_coin_denom];
      const procent = (amountAccountBalances / amountTotal) * 100;
      const shares = exponentialToDecimal(procent.toPrecision(2));
      setSharesToken(shares);
    }
  }, [totalSupplyData, pool, accountBalances]);

  const useInactive = useMemo(() => {
    try {
      let status = false;
      const { reserve_coin_denoms: reserveCoinDenoms } = pool;
      if (reserveCoinDenoms && Object.keys(reserveCoinDenoms).length > 0) {
        reserveCoinDenoms.forEach((itemCoin) => {
          if (itemCoin.includes('ibc')) {
            const { denom, path } = traseDenom(itemCoin);
            const result = tokenList.find((item) => item.denom === denom);
            if (result !== undefined) {
              const { counterpartyChainId, destChannelId } = result;
              const pathFromList = `${counterpartyChainId}/${destChannelId}`;
              if (pathFromList !== path) {
                status = true;
              }
            } else {
              status = true;
            }
          }
        });
      }

      return status;
    } catch (error) {
      console.log('error', error);
      return false;
    }
  }, [pool]);

  return (
    <ContainerGradient
      togglingDisable
      userStyleContent={{ minHeight: '210px' }}
      title={<TitlePool useInactive={useInactive} pool={pool} />}
    >
      <div>
        {pool.reserve_coin_denoms.map((items) => {
          const keyItem = uuidv4();

          return (
            <>
              <PoolItemsList key={keyItem} assets={pool.assets} token={items} />
            </>
          );
        })}
      </div>

      <div style={styleMySharesContainer}>
        <div style={styleTitleAmountPoolContainer}>Cap</div>
        <FormatNumberTokens
          value={pool.cap}
          text={CYBER.DENOM_LIQUID_TOKEN}
          marginContainer="0px"
        />
      </div>

      {sharesToken !== null && (
        <div style={styleMySharesContainer}>
          <div style={styleTitleAmountPoolContainer}>My shares</div>
          <div>
            {/* <FormatNumberTokens value={sharesToken} /> */}
            {sharesToken}%
          </div>
        </div>
      )}
    </ContainerGradient>
  );
};

const usePoolsAssetAmount = (pools) => {
  const { jsCyber, traseDenom, marketData } = useContext(AppContext);
  const [poolsBal, setPoolsBal] = useState([]);
  const [poolsData, setPoolsData] = useState([]);
  const [totalCap, setTotalCap] = useState(0);

  useEffect(() => {
    const lastPoolCapLocalStorage = localStorage.getItem('lastPoolCap');
    const lastPoolLocalStorage = localStorage.getItem('lastPoolData');

    if (lastPoolCapLocalStorage !== null) {
      setTotalCap(new BigNumber(lastPoolCapLocalStorage).toNumber());
    }

    if (lastPoolLocalStorage !== null) {
      const lastPoolLSData = JSON.parse(lastPoolLocalStorage);
      if (lastPoolLSData.length > 0) {
        setPoolsData(lastPoolLSData);
      }
    }
  }, []);

  useEffect(() => {
    const getBalances = async () => {
      if (jsCyber !== null && pools.length > 0) {
        const newArrPools = [];
        for (let index = 0; index < pools.length; index += 1) {
          const pool = pools[index];
          const assetsData = {};
          const { reserve_account_address: addressPool } = pool;
          // eslint-disable-next-line no-await-in-loop
          const getBalancePromise = await jsCyber.getAllBalances(addressPool);
          const dataReduceBalances = reduceBalances(getBalancePromise);
          Object.keys(dataReduceBalances).forEach((key) => {
            const amount = new BigNumber(dataReduceBalances[key]).toNumber();
            const { coinDecimals } = traseDenom(key);
            const reduceAmoun = convertAmount(amount, coinDecimals);
            assetsData[key] = reduceAmoun;
          });
          newArrPools.push({ ...pool, assets: { ...assetsData } });
        }
        setPoolsBal(newArrPools);
      }
    };
    getBalances();
  }, [jsCyber, pools]);

  useEffect(() => {
    if (poolsBal.length > 0) {
      const newArrPools = [];
      let totalCapTemp = new BigNumber(0);
      poolsBal.forEach((pool) => {
        const { reserve_coin_denoms: coinDenoms, assets } = pool;
        let cap = new BigNumber(0);
        coinDenoms.forEach((item) => {
          if (
            Object.keys(marketData).length > 0 &&
            Object.prototype.hasOwnProperty.call(assets, item) &&
            Object.prototype.hasOwnProperty.call(marketData, item)
          ) {
            const amountA = new BigNumber(assets[item]);
            const priceA = marketData[item];
            const capItem = amountA.multipliedBy(priceA);
            cap = cap.plus(capItem);
          }
        });
        totalCapTemp = totalCapTemp.plus(cap);
        newArrPools.push({ ...pool, cap: cap.toNumber() });
      });

      setTotalCap(totalCapTemp.dp(0, BigNumber.ROUND_FLOOR).toNumber());
      if (totalCapTemp.comparedTo(0)) {
        localStorage.setItem(
          'lastPoolCap',
          totalCapTemp.dp(0, BigNumber.ROUND_FLOOR).toString()
        );
      }

      if (Object.keys(marketData).length > 0) {
        const sortedArr = newArrPools.sort((a, b) => b.cap - a.cap);
        setPoolsData(sortedArr);
        localStorage.setItem('lastPoolData', JSON.stringify(sortedArr));
      } else {
        setPoolsData(newArrPools);
        localStorage.setItem('lastPoolData', JSON.stringify(newArrPools));
      }
    }
  }, [poolsBal, marketData]);

  return { poolsData, totalCap };
};

const useGetMySharesInPools = (accountBalances) => {
  const [myCap, setMyCap] = useState(0);
  const { marketData } = useContext(AppContext);

  useEffect(() => {
    let myCaptemp = new BigNumber(0);
    if (accountBalances !== null) {
      const filtered = Object.keys(accountBalances)
        .filter((key) => key.includes('pool'))
        .reduce((obj, key) => {
          return { ...obj, [key]: accountBalances[key] };
        }, {});
      if (Object.keys(filtered).length > 0) {
        Object.keys(filtered).forEach((key) => {
          const amount = new BigNumber(filtered[key]);
          if (Object.prototype.hasOwnProperty.call(marketData, key)) {
            const price = new BigNumber(marketData[key]);
            myCaptemp = myCaptemp.plus(amount.multipliedBy(price));
          }
        });
      }
      setMyCap(myCaptemp.dp(0, BigNumber.ROUND_FLOOR).toNumber());
    }
  }, [accountBalances, marketData]);

  return { myCap };
};

const stylePoolDataContainer = {
  display: 'grid',
  // gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,270px), 1fr))',
  gridGap: '50px',
  margin: '0 auto',
  width: '100%',
};

const PoolsInfo = ({ totalCap, myCap, useMyProcent }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '25px',
      }}
    >
      <ContainerGradientText>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <FormatNumberTokens
            value={totalCap}
            styleValue={{ fontSize: '18px' }}
            text={CYBER.DENOM_LIQUID_TOKEN}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '10px',
          }}
        >
          total Cap
        </div>
      </ContainerGradientText>
      <ContainerGradientText>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <FormatNumberTokens
            styleValue={{ fontSize: '18px' }}
            text={CYBER.DENOM_LIQUID_TOKEN}
            value={myCap}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '10px',
          }}
        >
          my Cap
        </div>
      </ContainerGradientText>
      <ContainerGradientText>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: '18px',
          }}
        >
          {useMyProcent}%
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '10px',
          }}
        >
          my procent
        </div>
      </ContainerGradientText>
    </div>
  );
};

function PoolData({ data, totalSupplyData, accountBalances }) {
  const { poolsData, totalCap } = usePoolsAssetAmount(data);
  const { myCap } = useGetMySharesInPools(accountBalances);

  const useMyProcent = useMemo(() => {
    if (totalCap > 0 && myCap > 0) {
      return new BigNumber(myCap)
        .dividedBy(totalCap)
        .multipliedBy(100)
        .dp(5, BigNumber.ROUND_FLOOR)
        .toNumber();
    }

    return 0;
  }, [totalCap, myCap]);

  const itemsPools = useMemo(() => {
    if (poolsData.length > 0) {
      return poolsData.map((item) => {
        const keyItem = uuidv4();

        return (
          <PoolCard
            key={keyItem}
            pool={item}
            totalSupplyData={totalSupplyData}
            accountBalances={accountBalances}
          />
        );
      });
    }
    return [];
  }, [poolsData]);

  return (
    <div style={stylePoolDataContainer}>
      <PoolsInfo
        myCap={myCap}
        totalCap={totalCap}
        useMyProcent={useMyProcent}
      />
      {Object.keys(itemsPools).length > 0 ? (
        itemsPools
      ) : (
        <NoItems text="No Pools" />
      )}
    </div>
  );
}

export default PoolData;
