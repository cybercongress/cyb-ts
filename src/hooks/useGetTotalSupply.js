import { useQuery } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from 'src/context';
import { CYBER } from 'src/utils/config';
import {
  findDenomInTokenList,
  reduceBalances,
  isNative,
} from 'src/utils/utils';

const defaultTokenList = {
  [CYBER.DENOM_CYBER]: 0,
  [CYBER.DENOM_LIQUID_TOKEN]: 0,
  milliampere: 0,
  millivolt: 0,
  tocyb: 0,
};

const totalSupplyFetcher = (client) => {
  if (client === null) {
    return null;
  }

  return client.totalSupply();
};

function useGetTotalSupply() {
  const { jsCyber, ibcDataDenom } = useContext(AppContext);
  const [totalSupplyAll, setTotalSupplyAll] = useState(null);
  const [totalSupplyProofList, setTotalSupplyProofList] = useState(null);
  const { data: dataGetTotalSupply } = useQuery(
    ['getTotalSupply'],
    () => totalSupplyFetcher(jsCyber),
    {
      enabled: Boolean(jsCyber),
    }
  );

  useEffect(() => {
    const getTotalSupply = async () => {
      if (dataGetTotalSupply) {
        const datareduceTotalSupply = reduceBalances(dataGetTotalSupply);

        if (Object.keys(datareduceTotalSupply).length > 0) {
          setTotalSupplyAll(datareduceTotalSupply);
        }

        const reduceData = {};

        if (Object.keys(ibcDataDenom).length > 0) {
          Object.keys(datareduceTotalSupply).forEach((key) => {
            const value = datareduceTotalSupply[key];
            if (!isNative(key)) {
              if (Object.prototype.hasOwnProperty.call(ibcDataDenom, key)) {
                const { baseDenom, sourceChannelId: sourceChannelIFromPath } =
                  ibcDataDenom[key];
                const denomInfoFromList = findDenomInTokenList(baseDenom);
                if (denomInfoFromList !== null) {
                  if (
                    Object.prototype.hasOwnProperty.call(
                      denomInfoFromList,
                      'destChannelId'
                    )
                  ) {
                    const { destChannelId } = denomInfoFromList;
                    if (destChannelId === sourceChannelIFromPath) {
                      reduceData[key] = value;
                    }
                  }
                }
              }
            } else if (key.indexOf('pool') !== 0) {
              reduceData[key] = value;
            }
          });
        }

        if (Object.keys(reduceData).length > 0) {
          setTotalSupplyProofList({ ...defaultTokenList, ...reduceData });
        } else {
          setTotalSupplyProofList({
            ...defaultTokenList,
            ...datareduceTotalSupply,
          });
        }
      }
    };

    getTotalSupply();
  }, [ibcDataDenom, dataGetTotalSupply]);

  return { totalSupplyProofList, totalSupplyAll };
}

export default useGetTotalSupply;
