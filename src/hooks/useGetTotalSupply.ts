import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { CYBER } from 'src/utils/config';
import {
  findDenomInTokenList,
  reduceBalances,
  isNative,
} from 'src/utils/utils';
import { Option } from 'src/types/common';
import { ObjKeyValue } from 'src/types/data';
import useSdk from './useSdk';
import useIbcDenom from './useIbcDenom';

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
  const { queryClient } = useSdk();
  const { ibcDenoms: ibcDataDenom } = useIbcDenom();
  const [totalSupplyAll, setTotalSupplyAll] =
    useState<Option<ObjKeyValue>>(undefined);
  const [totalSupplyProofList, setTotalSupplyProofList] =
    useState<Option<ObjKeyValue>>(undefined);
  const { data: dataGetTotalSupply } = useQuery(
    ['getTotalSupply'],
    () => totalSupplyFetcher(queryClient),
    {
      enabled: Boolean(queryClient),
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

        if (ibcDataDenom) {
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
