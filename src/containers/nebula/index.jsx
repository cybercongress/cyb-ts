/* eslint-disable no-await-in-loop */
import React, { useEffect, useState, useMemo, useContext } from 'react';
import BigNumber from 'bignumber.js';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  MainContainer,
  ContainerGradientText,
  InfoCard,
  ContainerGradient,
} from '../portal/components';
import { DenomArr } from '../../components';
import {
  formatNumber,
  replaceSlash,
  denonFnc,
  getDisplayAmount,
} from '../../utils/utils';
// import { getMarketData } from './getMarketData';
import useGetMarketData from './useGetMarketData';
import { ColItem, RowItem, FormatNumberTokens, NebulaImg } from './components';
import { CYBER } from '../../utils/config';
import { AppContext } from '../../context';

function Nebula({ mobile }) {
  const { traseDenom } = useContext(AppContext);
  const { dataTotal, marketData } = useGetMarketData();
  const [capData, setCapData] = useState({ currentCap: 0, change: 0 });

  useEffect(() => {
    if (Object.keys(dataTotal).length > 0) {
      let cap = 0;
      Object.keys(dataTotal).forEach((key) => {
        const amount = dataTotal[key];
        const { coinDecimals } = traseDenom(key);
        const reduceAmount = getDisplayAmount(amount, coinDecimals);
        if (
          Object.keys(marketData).length > 0 &&
          Object.prototype.hasOwnProperty.call(marketData, key)
        ) {
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
    if (Object.keys(dataTotal).length > 0) {
      Object.keys(dataTotal).forEach((key) => {
        const amount = dataTotal[key];
        let price = 0;
        let cap = 0;
        const { coinDecimals } = traseDenom(key);
        const reduceAmount = getDisplayAmount(amount, coinDecimals);

        if (
          Object.keys(marketData).length > 0 &&
          Object.prototype.hasOwnProperty.call(marketData, key)
        ) {
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

  const getTypeDenomKey = (key) => {
    const { denom } = traseDenom(key);

    if (denom.includes('ibc')) {
      return replaceSlash(denom);
    }

    if (key.includes('pool')) {
      return `${getTypeDenomKey(denom[0].denom)}-${getTypeDenomKey(
        denom[1].denom
      )}`;
    }

    return denom;
  };

  const getLinktoSearch = (key) => {
    return `/search/${getTypeDenomKey(key)}`;
  };

  const itemRowMarketData = useMemo(() => {
    return Object.keys(dataRenderItems).map((key) => {
      const keyItem = uuidv4();
      return (
        <RowItem key={keyItem}>
          <ColItem>
            <Link to={getLinktoSearch(key)}>
              <DenomArr marginImg="0 0 0 3px" denomValue={key} onlyText />
            </Link>
          </ColItem>
          <ColItem justifyContent="flex-end">
            <FormatNumberTokens
              text={key}
              value={dataRenderItems[key].supply}
              tooltipStatusImg={false}
            />
          </ColItem>
          <ColItem justifyContent="flex-end">
            <FormatNumberTokens
              text={CYBER.DENOM_LIQUID_TOKEN}
              value={dataRenderItems[key].price}
              tooltipStatusImg={false}
            />
          </ColItem>
          <ColItem justifyContent="flex-end">
            <FormatNumberTokens
              value={dataRenderItems[key].cap}
              text={CYBER.DENOM_LIQUID_TOKEN}
              tooltipStatusImg={false}
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
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
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
          <FormatNumberTokens
            text={CYBER.DENOM_LIQUID_TOKEN}
            value={capData.currentCap}
            tooltipStatusImg={false}
          />
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
  };
};

export default connect(mapStateToProps)(Nebula);
