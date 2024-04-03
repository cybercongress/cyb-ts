import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  findDenomInTokenList,
  reduceBalances,
  isNative,
} from 'src/utils/utils';
import { Option } from 'src/types';
import { ObjKeyValue } from 'src/types/data';
import { CyberClient } from '@cybercongress/cyber-js';
import { useQueryClient } from 'src/contexts/queryClient';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import { BASE_DENOM, DENOM_LIQUID } from 'src/constants/config';

type OptionInterval = {
  refetchInterval?: number | false;
};

const defaultTokenList = {
  [BASE_DENOM]: 0,
  [DENOM_LIQUID]: 0,
  milliampere: 0,
  millivolt: 0,
  tocyb: 0,
};

const totalSupplyFetcher = (client: Option<CyberClient>) => {
  if (!client) {
    return undefined;
  }

  return client.totalSupply();
};

function useGetTotalSupply(
  option: OptionInterval = { refetchInterval: false }
) {
  const queryClient = useQueryClient();
  const { ibcDenoms: ibcDataDenom } = useIbcDenom();
  const [totalSupplyAll, setTotalSupplyAll] =
    useState<Option<ObjKeyValue>>(undefined);
  const [totalSupplyProofList, setTotalSupplyProofList] =
    useState<Option<ObjKeyValue>>(undefined);
  const { data: dataGetTotalSupply } = useQuery(
    ['totalSupply'],
    () => totalSupplyFetcher(queryClient),
    {
      enabled: Boolean(queryClient),
      refetchInterval: option.refetchInterval,
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
