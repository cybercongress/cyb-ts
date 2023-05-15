/* eslint-disable */
import BigNumber from 'bignumber.js';
import { reduceBalances, convertAmount } from '../../utils/utils';

import { MainContainer } from '../portal/components';
import { DenomArr, Particle } from '../../components';
import Denom from 'src/components/denom';

// const token = Buffer.from(`anonymas:mouse123west`, 'utf8').toString('base64');
const token = 'anonymas:mouse123west';

// const headers = {
//   authorization: `Basic YW5vbnltYXM6bW91c2UxMjN3ZXN0`,
// };

const addressTest = 'bostromvaloper1ydc5fy9fjdygvgw36u49yj39fr67pd9m5qexm8';

const headers = {
  'Content-Type': 'application/json',
};

const bootTocyb =
  'poolBE0F1D1C7FE3E72D18DF1996AB8E76676852A34313D2772E7ED36B041DCAB182';
const milliampere = 'milliampere';

const testDenom =
  'ibc/8D9262E35CAE362FA74AE05E430550757CF8D842EC1B241F645D3CB7179AFD10';

const slidesTest = [
  {
    title: 'STEP_GIFT_INFO',
  },
  {
    title: 'STEP_PROVE_ADD',
  },
  {
    title: 'STEP_CLAIME',
  },
  {
    title: 'STEP_!!',
  },
  {
    title: 'STEP_3333',
  },
];

const getPoolsBalance = async (data, client) => {
  const copyObj = { ...data };
  // eslint-disable-next-line no-restricted-syntax
  for (const key in copyObj) {
    if (Object.hasOwnProperty.call(copyObj, key)) {
      const element = copyObj[key];
      const { reserveAccountAddress } = element;
      // eslint-disable-next-line no-await-in-loop
      const dataBalsnce = await client.getAllBalances(reserveAccountAddress);
      const reduceDataBalances = reduceBalances(dataBalsnce);
      element.balances = reduceDataBalances;
    }
  }
  return copyObj;
};

const testFunc = (responseDataPools, jsCyber) => {
  const getTokenIndexer = (wtl) => {
    const tokenIndexer = {};
    if (wtl) {
      wtl.forEach((item) => {
        tokenIndexer[item.denom] = item.amount;
      });
    }
    return tokenIndexer;
  };

  const calculatePrice = (coinsPair, balances, traseDenom) => {
    let price = 0;
    const tokenA = coinsPair[0];
    const tokenB = coinsPair[1];
    const [{ coinDecimals: coinDecimalsA }] = traseDenom(tokenA);
    const [{ coinDecimals: coinDecimalsB }] = traseDenom(tokenB);

    const amountA = new BigNumber(
      convertAmount(balances[tokenA], coinDecimalsA)
    );
    const amountB = new BigNumber(
      convertAmount(balances[tokenB], coinDecimalsB)
    );

    if (amountA.comparedTo(0) && amountB.comparedTo(0)) {
      price = amountA.dividedBy(amountB).toNumber();
    }

    return price;
  };

  // console.log('data', reduceObj);
  // const poolsBalance = await getPoolsBalance(reduceObj, jsCyber);
  // console.log('poolsBalance', jsCyber);
  const copyObjTemp = [];
  if (responseDataPools && Object.keys(responseDataPools).length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in responseDataPools) {
      if (Object.hasOwnProperty.call(responseDataPools, key)) {
        const element = responseDataPools[key];
        const { reserveAccountAddress } = element;
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

  console.log('copyObjTemp', copyObjTemp);

  copyObjTemp.forEach((element) => {
    if (element.balances) {
      const { balances } = element;
      console.log('balances', balances);
    }
  });

  // tempObj = copyObjTemp;

  return 'data';
};

function TestKeplr() {
  // const { result, error, run } = useWebworker(testFunc);

  // console.log('result', result);
  // console.log('error', error);

  // useEffect(() => {
  //   const getPools = async () => {
  //     if (jsCyber !== null) {
  //       try {
  //         const response = await jsCyber.pools();
  //         if (response && response !== null && response.pools) {
  //           const { pools } = response;
  //           // console.log('pools', pools);
  //           const reduceObj = pools.reduce(
  //             (obj, item) => ({
  //               ...obj,
  //               [item.poolCoinDenom]: {
  //                 ...item,
  //               },
  //             }),
  //             {}
  //           );
  //           run(reduceObj, jsCyber);
  //         }
  //       } catch (e) {
  //         console.log('error', e);
  //       }
  //     }
  //   };
  //   getPools();
  // }, [jsCyber]);

  return (
    <MainContainer>
      {/* <Particle cid="QmX7kEC9qnP3MnHNSfVZcnFDgV3m5tegdcvDatpKtVeWDz" /> */}
      {/* <Particle cid="QmeVVkLxBjVfbZ1uFsJsBkzQ3ZxrAVKgRYnFsfDDBpJrMb" /> */}
      {/* <Particle cid="QmRdMmkcZKXPARbBFe5zcmAn2R1TrfoDqN7Q7w6J9Dwt6o" /> */}
      <DenomArr denomValue={bootTocyb} />
      <DenomArr denomValue={testDenom} />
    </MainContainer>
  );
}

export default TestKeplr;
