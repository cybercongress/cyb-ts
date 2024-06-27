import { useEffect, useState } from 'react';
import { ObjKeyValue } from 'src/types/data';
import BigNumber from 'bignumber.js';
import { DENOM_LIQUID } from 'src/constants/config';
import useFindPoolPrice from './useFindPoolPrice';

function useConvertMarketData(marketData: ObjKeyValue) {
  const [resultData, setResultData] = useState({});
  const poolPrice = useFindPoolPrice();

  useEffect(() => {
    if (!poolPrice || !Object.keys(marketData).length) {
      return;
    }

    const reduceMarketData = Object.entries(marketData).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]:
          key === DENOM_LIQUID
            ? 1
            : new BigNumber(value).multipliedBy(poolPrice).toNumber(),
      }),
      {}
    );

    setResultData(reduceMarketData);
  }, [poolPrice, marketData]);

  return resultData;
}

export default useConvertMarketData;
