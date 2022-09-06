/* eslint-disable no-await-in-loop */
import React, { useEffect, useState, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import { useWorker } from '@koale/useworker';
import { Link } from 'react-router-dom';
import {
  MainContainer,
  ContainerGradientText,
  InfoCard,
  ContainerGradient,
} from '../portal/components';
import { DenomArr } from '../../components';
import { formatNumber } from '../../utils/utils';
import { reduceAmounToken } from '../teleport/utils';
// import { getMarketData } from './getMarketData';
import useGetMarketData from './useGetMarketData';
import { ColItem, RowItem, FormatNumberTokens, NebulaImg } from './components';
import coinDecimalsConfig from '../../utils/configToken';

const getTypeDenom = (denom) => {
  if (denom.includes('ibc')) {
    return 'blue';
  }

  if (denom.includes('pool')) {
    return 'pink';
  }

  return 'green';
};

const getTypeDenomKey = (denom) => {
  if (denom.includes('ibc') || denom.includes('pool')) {
    return denom;
  }

  if (Object.prototype.hasOwnProperty.call(coinDecimalsConfig, denom)) {
    return coinDecimalsConfig[denom].denom;
  }

  return denom;
};

function getMarketData() {
  const getTokenIndexer = (wtl) => {
    const tokenIndexer = {};
    if (wtl) {
      wtl.forEach((item) => {
        tokenIndexer[item.denom] = item.amount;
      });
    }
    return tokenIndexer;
  };
  return new Promise((resolve) =>
    fetch('https://lcd.bostrom.cybernode.ai//cosmos/liquidity/v1beta1/pools')
      .then((response) => response.json())
      .then((data) => data.pools)
      .then((responseDataPools) => {
        const copyObjTemp = [];

        // console.log('responseDataPools', responseDataPools);
        if (responseDataPools && Object.keys(responseDataPools).length > 0) {
          // eslint-disable-next-line no-restricted-syntax
          for (const key in responseDataPools) {
            if (Object.hasOwnProperty.call(responseDataPools, key)) {
              const element = responseDataPools[key];
              const { reserve_account_address: reserveAccountAddress } =
                element;
              // eslint-disable-next-line no-await-in-loop
              fetch(
                `https://lcd.bostrom.cybernode.ai/bank/balances/${reserveAccountAddress}`
              )
                .then((response) => response.json())
                .then((data) => data.result)
                .then((dataBalance) => {
                  // console.log('dataBalance', dataBalance);
                  element.balances = getTokenIndexer(dataBalance);
                  copyObjTemp.push(element);
                });
            }
          }
          console.log('copyObjTemp', copyObjTemp);
          if (copyObjTemp.length > 0) {
            console.log('copyObjTemp', copyObjTemp);
            resolve(responseDataPools);
          }
        }
        // console.log('responseDataPools', responseDataPools)
      })
      .catch((e) => [])
  );
}

function Nebula({ node, mobile, defaultAccount }) {
  const { dataTotal, marketData } = useGetMarketData();
  const [capData, setCapData] = useState({ currentCap: 0, change: 0 });

  useEffect(() => {
    if (
      Object.keys(marketData).length > 0 &&
      Object.keys(dataTotal).length > 0
    ) {
      let cap = 0;
      Object.keys(dataTotal).forEach((key) => {
        const amount = dataTotal[key];
        const reduceAmount = reduceAmounToken(parseFloat(amount), key);
        if (Object.prototype.hasOwnProperty.call(marketData, key)) {
          const poolPrice = new BigNumber(marketData[key]);
          const tempCap = poolPrice
            .multipliedBy(Number(reduceAmount))
            .dp(0, BigNumber.ROUND_FLOOR)
            .toNumber();
          cap += tempCap;
        }
      });

      if (cap > 0) {
        const localStorageDataCap = localStorage.getItem('lastCap');
        if (localStorageDataCap !== null) {
          let change = 0;
          change = cap - localStorageDataCap;

          setCapData({ currentCap: cap, change });

          localStorage.setItem('lastCap', cap);
        } else {
          localStorage.setItem('lastCap', cap);
          setCapData({ currentCap: cap, change: 0 });
        }
      }
    }
  }, [dataTotal, marketData]);

  const dataRenderItems = useMemo(() => {
    let dataObj = {};
    if (
      Object.keys(dataTotal).length > 0 &&
      Object.keys(marketData).length > 0
    ) {
      Object.keys(dataTotal).forEach((key) => {
        const amount = dataTotal[key];
        let price = 0;
        let cap = 0;
        const reduceAmount = reduceAmounToken(parseFloat(amount), key);
        if (Object.prototype.hasOwnProperty.call(marketData, key)) {
          const poolPrice = new BigNumber(marketData[key]);
          cap = poolPrice
            .multipliedBy(Number(reduceAmount))
            .dp(0, BigNumber.ROUND_FLOOR)
            .toNumber();
          price = poolPrice.toNumber();
        }
        dataObj[key] = {
          supply: reduceAmount,
          price,
          cap,
        };
      });
    }
    if (Object.keys(dataObj).length > 0) {
      const sortable = Object.fromEntries(
        Object.entries(dataObj).sort(([, a], [, b]) => b.cap - a.cap)
      );
      dataObj = sortable;
    }
    return dataObj;
  }, [dataTotal, marketData]);

  const itemRowMarketData = useMemo(() => {
    return Object.keys(dataRenderItems).map((key) => {
      const keyItem = uuidv4();
      return (
        <RowItem key={keyItem}>
          <ColItem>
            <Link to={`/search/${getTypeDenomKey(key)}`}>
              <DenomArr marginImg="0 0 0 3px" denomValue={key} onlyText />
            </Link>
          </ColItem>
          <ColItem justifyContent="flex-end">
            <FormatNumberTokens
              text={key}
              value={dataRenderItems[key].supply}
            />
          </ColItem>
          <ColItem justifyContent="flex-end">
            <FormatNumberTokens
              text="hydrogen"
              value={dataRenderItems[key].price}
            />
          </ColItem>
          <ColItem justifyContent="flex-end">
            <FormatNumberTokens
              value={dataRenderItems[key].cap}
              text="hydrogen"
            />
          </ColItem>
        </RowItem>
      );
    });
  }, [dataRenderItems]);

  const Title = () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        // paddingBottom: '20px',
      }}
    >
      <div style={{ fontSize: '22px', width: '112px', height: '112px' }}>
        <NebulaImg />
      </div>
      {capData.currentCap !== 0 && (
        <div style={{ display: 'flex', gap: '40px' }}>
          {capData.change !== 0 && (
            <div
              style={{
                color: capData.change > 0 ? '#7AFAA1' : '#FF0000',
              }}
            >
              {capData.change > 0 ? '+' : ''}
              {formatNumber(capData.change)}
            </div>
          )}
          <FormatNumberTokens text="hydrogen" value={capData.currentCap} />
        </div>
      )}
    </div>
  );

  return (
    <MainContainer width="83%">
      <InfoCard>
        <div style={{ textAlign: 'center' }}>
          This is nebula. <br /> You can see the token emission on the left,
          <br /> price in the middle and total capitalization in hydrogene on
          the right.
        </div>
      </InfoCard>
      <ContainerGradient
        userStyleContent={{ minHeight: 'auto', height: 'unset' }}
        title={<Title />}
        togglingDisable
      >
        <div>{itemRowMarketData}</div>
      </ContainerGradient>
    </MainContainer>
  );
}

const mapStateToProps = (store) => {
  return {
    mobile: store.settings.mobile,
    node: store.ipfs.ipfs,
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(Nebula);
