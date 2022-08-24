/* eslint-disable no-await-in-loop */
import React, {
  useEffect,
  useState,
  useMemo,
  useContext,
  useCallback,
} from 'react';
import BigNumber from 'bignumber.js';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import { useWorker } from '@koale/useworker';
import { AppContext } from '../../context';
import {
  MainContainer,
  ContainerGradientText,
  InfoCard,
} from '../portal/components';
import { DenomArr, NumberCurrency, FormatNumber } from '../../components';
import {
  formatNumber,
  reduceBalances,
  exponentialToDecimal,
  roundNumber,
} from '../../utils/utils';
import { getCoinDecimals, reduceAmounToken } from '../teleport/utils';
import PillStatus from './pillStatus';
import { CYBER } from '../../utils/config';
// import { getMarketData } from './getMarketData';
import { useWebworker } from './useWebworker';
import useGetMarketData from './useGetMarketData';
import { ColItem, RowItem, FormatNumberTokens } from './components';

const getTypeDenom = (denom) => {
  if (denom.includes('ibc')) {
    return 'blue';
  }

  if (denom.includes('pool')) {
    return 'pink';
  }

  return 'green';
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
            <DenomArr marginImg="0 0 0 3px" denomValue={key} onlyText />
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

  return (
    <MainContainer width="83%">
      <InfoCard>This is Nebula</InfoCard>
      <ContainerGradientText>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '40px 0px',
          }}
        >
          <div style={{ fontSize: '22px' }}>Nebula</div>
          <div style={{ display: 'flex', gap: '40px' }}>
            <div style={{ color: capData.change > 0 ? '#7AFAA1' : '#FF0000' }}>
              {capData.change > 0 ? '+' : '-'} {formatNumber(capData.change)}
            </div>
            <FormatNumberTokens text="hydrogen" value={capData.currentCap} />
          </div>
        </div>
        <div>{itemRowMarketData}</div>
      </ContainerGradientText>
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
