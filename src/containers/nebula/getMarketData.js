import axios from 'axios';
import BigNumber from 'bignumber.js';
import { CYBER } from '../../utils/config';
import { reduceBalances } from '../../utils/utils';
import { getAvailable } from '../../utils/search/utils';
// import { getCoinDecimals } from '../teleport/utils';

// function poolApiCall() {
//   return new Promise((resolve) =>
//     fetch('https://lcd.bostrom.cybernode.ai//cosmos/liquidity/v1beta1/pools')
//       .then((response) => response.json())
//       .then((data) => {
//         resolve(data.pools);
//       })
//       .catch((e) => [])
//   );
// }

// const calculatePrice = (coinsPair, balances) => {
//   let price = 0;
//   const tokenA = coinsPair[0];
//   const tokenB = coinsPair[1];
//   const amountA = new BigNumber(
//     getCoinDecimals(Number(balances[tokenA]), tokenA)
//   );
//   const amountB = new BigNumber(
//     getCoinDecimals(Number(balances[tokenB]), tokenB)
//   );

//   if ([tokenA, tokenB].sort()[0] !== tokenA) {
//     price = amountB.dividedBy(amountA);
//     price = price.multipliedBy(0.97).toNumber();
//   } else {
//     price = amountA.dividedBy(amountB);
//     price = price.multipliedBy(1.03).toNumber();
//   }
//   return price;
// };

const getPoolsBalance = async (data, client) => {
  const copyObj = { ...data };
  // eslint-disable-next-line no-restricted-syntax
  for (const key in copyObj) {
    if (Object.hasOwnProperty.call(copyObj, key)) {
      const element = copyObj[key];
      const { reserve_account_address: reserveAccountAddress } = element;
      // eslint-disable-next-line no-await-in-loop
      const dataBalsnce = await getAvailable(reserveAccountAddress);
      element.balances = reduceBalances(dataBalsnce);
    }
  }
  return copyObj;
};

// const getPoolPrice = (data) => {
//   const copyObj = { ...data };
//   Object.keys(copyObj).forEach((key) => {
//     const element = copyObj[key];
//     if (element.balances) {
//       const coinsPair = element.reserve_coin_denoms;
//       const { balances } = element;
//       let price = 0;
//       if (coinsPair[0] === 'hydrogen' || coinsPair[1] === 'hydrogen') {
//         if (coinsPair[0] === 'hydrogen') {
//           price = calculatePrice(coinsPair.reverse(), balances);
//         } else {
//           price = calculatePrice(coinsPair, balances);
//         }
//       } else {
//         price = calculatePrice(coinsPair, balances);
//       }

//       element.price = price;
//     }
//   });
//   return copyObj;
// };

const { getCoinDecimals } = require('../teleport/utils');

const getMarketData = () => {
  try {
    let tempObj = [];
    const getTokenIndexer = (wtl) => {
      const tokenIndexer = {};
      if (wtl) {
        wtl.forEach((item) => {
          tokenIndexer[item.denom] = item.amount;
        });
      }
      return tokenIndexer;
    };

    // const calculatePrice = (coinsPair, balances) => {
    //   let price = 0;
    //   const tokenA = coinsPair[0];
    //   const tokenB = coinsPair[1];
    //   console.log('tokenB', tokenB);
    //   const amountA = new BigNumber(
    //     getCoinDecimals(Number(balances[tokenA]), tokenA)
    //   );
    //   console.log('amountA', amountA);
    //   const amountB = new BigNumber(
    //     getCoinDecimals(Number(balances[tokenB]), tokenB)
    //   );

    //   if ([tokenA, tokenB].sort()[0] !== tokenA) {
    //     price = amountB.dividedBy(amountA);
    //     price = price.multipliedBy(0.97).toNumber();
    //   } else {
    //     price = amountA.dividedBy(amountB);
    //     price = price.multipliedBy(1.03).toNumber();
    //   }
    //   return price;
    // };
    return new Promise((resolve) =>
      fetch('https://lcd.bostrom.cybernode.ai//cosmos/liquidity/v1beta1/pools')
        .then((response) => response.json())
        .then((data) => data.pools)
        .then((responseDataPools) => {
          const copyObjTemp = [];
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
                    element.balances = getTokenIndexer(dataBalance);
                  });
                copyObjTemp.push(element);
              }
            }
          }
          tempObj = copyObjTemp;
        })
        .then(() => {
          // const copyObj1 = JSON.parse(JSON.stringify(poolsBalance));

          tempObj.forEach((item) => {
            console.log('item', item);
            console.log('element.balance', item.balances);
          });
          // Object.keys(copyObj1).forEach((key) => {
          //   const element = copyObj1[key];
          //   console.log('element', element);
          //   console.log('element.balance', element.balances);
          //   // if (element.balances) {
          //   //   const coinsPair = element.reserve_coin_denoms;
          //   //   const { balances } = element;
          //   //   let price = 0;
          //   //   if (coinsPair[0] === 'hydrogen' || coinsPair[1] === 'hydrogen') {
          //   //     if (coinsPair[0] === 'hydrogen') {
          //   //       price = calculatePrice(coinsPair.reverse(), balances);
          //   //     } else {
          //   //       price = calculatePrice(coinsPair, balances);
          //   //     }
          //   //   } else {
          //   //     price = calculatePrice(coinsPair, balances);
          //   //   }
          //   //   console.log('price', price);

          //   //   element.price = price;
          //   // }
          // });
          return poolsBalance;
        })
        .catch((e) => [])
    );
    // if (responseDataPools && Object.keys(responseDataPools).length > 0) {
    //   const poolsBalance = await getPoolsBalance(responseDataPools);
    //   const poolPriceObj = getPoolPrice(poolsBalance);
    //   const marketDataObj = {};
    //   marketDataObj.hydrogen = 1;
    //   Object.keys(poolPriceObj).forEach((key) => {
    //     const item = poolPriceObj[key];
    //     const { reserve_coin_denoms: reserveCoinDenoms } = item;
    //     if (reserveCoinDenoms[1] === 'hydrogen') {
    //       marketDataObj[reserveCoinDenoms[0]] = item.price;
    //     }
    //   });
    //   console.log('marketDataObj', marketDataObj);
    // }
  } catch (error) {
    console.log('error', error);
  }
};

export { getMarketData };
