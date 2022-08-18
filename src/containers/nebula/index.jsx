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
import { MainContainer, ContainerGradientText, InfoCard } from '../portal/components';
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

  const itemRowMarketData = useMemo(() => {
    return Object.keys(dataTotal).map((key) => {
      const keyItem = uuidv4();
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
      return (
        <ContainerGradientText status={getTypeDenom(key)}>
          <RowItem key={keyItem}>
            <ColItem>
              <DenomArr marginImg="0 0 0 3px" denomValue={key} onlyText />
            </ColItem>
            <ColItem justifyContent="flex-end">
              <FormatNumberTokens text={key} value={reduceAmount} />
            </ColItem>
            <ColItem justifyContent="flex-end">
              <FormatNumberTokens text="hydrogen" value={price} />
            </ColItem>
            <ColItem justifyContent="flex-end">
              <FormatNumberTokens value={cap} text="hydrogen" />
            </ColItem>
          </RowItem>
        </ContainerGradientText>
      );
    });
  }, [dataTotal, marketData]);

  return (
    <MainContainer width="83%">
      <InfoCard>
        This is template text, here will be shown cyb help texts
      </InfoCard>
      <div>{itemRowMarketData}</div>
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
