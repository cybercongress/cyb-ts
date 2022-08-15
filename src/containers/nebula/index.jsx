/* eslint-disable no-await-in-loop */
import React, { useEffect, useState, useMemo, useContext } from 'react';
import BigNumber from 'bignumber.js';
import { TableEv as Table, Tooltip, Pane, Text } from '@cybercongress/gravity';
import { connect } from 'react-redux';
import { useWorker } from '@koale/useworker';
import { AppContext } from '../../context';
import { MainContainer } from '../portal/components';
import { DenomArr, NumberCurrency, FormatNumber } from '../../components';
import { formatNumber, reduceBalances } from '../../utils/utils';
import { getCoinDecimals, reduceAmounToken } from '../teleport/utils';
import PillStatus from './pillStatus';
import { CYBER } from '../../utils/config';
// import { getMarketData } from './getMarketData';
import { useWebworker } from './useWebworker';

const defaultTokenList = {
  boot: 0,
  hydrogen: 0,
  milliampere: 0,
  millivolt: 0,
  tocyb: 0,
};

const FormatNumberTokens = ({ text, value, ...props }) => {
  // console.log(text, value);
  return (
    <Pane
      display="grid"
      gridTemplateColumns="1fr 55px"
      gridGap="5px"
      fontSize="15px"
      {...props}
    >
      <Pane
        // paddingRight={5}
        whiteSpace="nowrap"
        display="flex"
        alignItems="center"
      >
        <span>{formatNumber(value)}</span>
      </Pane>
      {text && (
        <DenomArr
          marginImg="0 3px 0 0"
          flexDirection="row-reverse"
          justifyContent="flex-end"
          denomValue={text}
          onlyImg
        />
      )}
    </Pane>
  );
};

const getTypeDenom = (denom) => {
  if (denom.includes('ibc')) {
    return 'ibc';
  }

  if (denom.includes('pool')) {
    return 'pool';
  }

  return 'native';
};

export const TextTable = ({ children, fontSize, color, display, ...props }) => (
  <Text
    fontSize={`${fontSize || 13}px`}
    color={`${color || '#fff'}`}
    display={`${display || 'inline-flex'}`}
    alignItems="center"
    {...props}
  >
    {children}
  </Text>
);

const getPoolsBalance = async (data, client) => {
  const copyObj = { ...data };
  // eslint-disable-next-line no-restricted-syntax
  for (const key in copyObj) {
    if (Object.hasOwnProperty.call(copyObj, key)) {
      const element = copyObj[key];
      const { reserveAccountAddress } = element;
      const dataBalsnce = await client.getAllBalances(reserveAccountAddress);
      element.balances = reduceBalances(dataBalsnce);
    }
  }
  return copyObj;
};

const calculatePrice = (coinsPair, balances) => {
  let price = 0;
  const tokenA = coinsPair[0];
  const tokenB = coinsPair[1];
  const amountA = new BigNumber(
    getCoinDecimals(Number(balances[tokenA]), tokenA)
  );
  const amountB = new BigNumber(
    getCoinDecimals(Number(balances[tokenB]), tokenB)
  );

  if ([tokenA, tokenB].sort()[0] !== tokenA) {
    price = amountB.dividedBy(amountA);
    price = price.multipliedBy(0.97).toNumber();
  } else {
    price = amountA.dividedBy(amountB);
    price = price.multipliedBy(1.03).toNumber();
  }
  return price;
};

const getPoolPrice = (data) => {
  const copyObj = { ...data };
  Object.keys(copyObj).forEach((key) => {
    const element = copyObj[key];
    if (element.balances) {
      const coinsPair = element.reserveCoinDenoms;
      const { balances } = element;
      let price = 0;
      if (coinsPair[0] === 'hydrogen' || coinsPair[1] === 'hydrogen') {
        if (coinsPair[0] === 'hydrogen') {
          price = calculatePrice(coinsPair.reverse(), balances);
        } else {
          price = calculatePrice(coinsPair, balances);
        }
      } else {
        price = calculatePrice(coinsPair, balances);
      }

      element.price = price;
    }
  });
  return copyObj;
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
          console.log('copyObjTemp', copyObjTemp)
          if (copyObjTemp.length > 0) {
            console.log('copyObjTemp', copyObjTemp)
            resolve(responseDataPools);
          }
        }
        // console.log('responseDataPools', responseDataPools)
      })
      .catch((e) => [])
  );
}

function Nebula({ node, mobile, defaultAccount }) {
  const { jsCyber } = useContext(AppContext);
  const [fetchDataWorker] = useWorker(getMarketData);
  const [dataTotal, setDataTotal] = useState([]);
  const [poolsTotal, setPoolsTotal] = useState([]);
  const [marketData, setMarketData] = useState({});

  useEffect(() => {
    async function testFetchImageWorker(url) {
      const blob = await fetchDataWorker(url);
      console.log('blob', blob);
    }

    const url = `${CYBER.CYBER_NODE_URL_LCD}/cosmos/liquidity/v1beta1/pools`;
    testFetchImageWorker(url);
  }, []);

  useEffect(() => {
    const getBankTotal = async () => {
      if (jsCyber !== null) {
        const dataTotalSupply = await jsCyber.totalSupply();
        try {
          if (dataTotalSupply && dataTotalSupply.length > 0) {
            // const filteredDataTotalSupply = dataTotalSupply.filter(
            //   (item) => !item.denom.includes('pool')
            // );
            const reduceDataTotalSupply = reduceBalances(dataTotalSupply);
            setDataTotal({ ...defaultTokenList, ...reduceDataTotalSupply });
          }
        } catch (error) {
          console.log('error', error);
          setDataTotal([]);
        }
      }
    };
    getBankTotal();
  }, [jsCyber]);

  useEffect(() => {
    const getPpools = async () => {
      if (jsCyber !== null) {
        const dataPools = await jsCyber.pools();
        try {
          const { pools } = dataPools;
          if (dataPools && pools && Object.keys(pools).length > 0) {
            const poolsBalance = await getPoolsBalance(pools, jsCyber);
            const poolPriceObj = getPoolPrice(poolsBalance);
            setPoolsTotal(poolPriceObj);
          }
        } catch (error) {
          console.log('error', error);
          setPoolsTotal([]);
        }
      }
    };
    getPpools();
  }, [jsCyber]);

  useEffect(() => {
    try {
      if (
        Object.keys(dataTotal).length > 0 &&
        Object.keys(poolsTotal).length > 0
      ) {
        const marketDataObj = {};
        marketDataObj.hydrogen = 1;
        Object.keys(dataTotal).forEach((keyI) => {
          Object.keys(poolsTotal).forEach((keyJ) => {
            const itemJ = poolsTotal[keyJ];
            const { reserveCoinDenoms } = itemJ;
            if (
              reserveCoinDenoms[0] === keyI &&
              reserveCoinDenoms[1] === 'hydrogen'
            ) {
              marketDataObj[keyI] = itemJ.price;
            }
          });
        });
        setMarketData(marketDataObj);
      }
    } catch (error) {
      console.log('error', error);
    }
  }, [dataTotal, poolsTotal]);

  const itemRowMarketData = useMemo(() => {
    return Object.keys(dataTotal).map((key) => {
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
        <Table.Row
          borderBottom="none"
          // backgroundColor={index === selectedIndex ? '#ffffff29' : '#000'}
          isSelectable
        >
          <Table.TextCell flex={0.7} paddingX={5} textAlign="end" isNumber>
            <TextTable justifyContent="space-between" width="100%">
              <PillStatus type={getTypeDenom(key)} />
              <DenomArr marginImg="0 0 0 3px" denomValue={key} />
            </TextTable>
          </Table.TextCell>
          <Table.TextCell paddingX={5} textAlign="end" isNumber>
            <TextTable>{formatNumber(reduceAmount)}</TextTable>
          </Table.TextCell>
          <Table.TextCell paddingX={5} textAlign="end" isNumber>
            <TextTable>
              <FormatNumberTokens
                text="hydrogen"
                value={price}
                fontSizeDecimal={11.5}
              />
            </TextTable>
          </Table.TextCell>
          <Table.TextCell paddingX={5} textAlign="end" isNumber>
            <TextTable>
              <FormatNumberTokens value={cap} text="hydrogen" />
            </TextTable>
          </Table.TextCell>
        </Table.Row>
      );
    });
  }, [dataTotal, marketData]);

  return (
    <main className="block-body">
      <Table>
        <Table.Head
          style={{
            backgroundColor: '#000',
            borderBottom: '1px solid #ffffff80',
            marginTop: '10px',
            paddingBottom: '10px',
          }}
        >
          <Table.TextHeaderCell flex={0.7} textAlign="center" paddingX={5}>
            <TextTable fontSize={13}>token</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell paddingX={5} textAlign="center">
            <TextTable fontSize={13} whiteSpace="nowrap">
              supply
            </TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell paddingX={5} textAlign="center">
            <TextTable fontSize={13}>price</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell paddingX={5} textAlign="center">
            <TextTable fontSize={13}>cap</TextTable>
          </Table.TextHeaderCell>
        </Table.Head>
        <Table.Body
          style={{
            backgroundColor: '#000',
            overflowY: 'hidden',
            padding: 7,
          }}
        >
          {itemRowMarketData}
        </Table.Body>
      </Table>
    </main>
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
