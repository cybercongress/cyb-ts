import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import usePoolListInterval from 'src/hooks/usePoolListInterval';
import { useQueryClient } from 'src/contexts/queryClient';
import { Option } from 'src/types';
import {
  IbcDenomsArr,
  TraseDenomFuncResponse,
  TraseDenomFuncType,
} from 'src/types/ibc';
import {
  findDenomInTokenList,
  findPoolDenomInArr,
  getDenomHash,
  isNative,
} from 'src/utils/utils';

type IbcDenomContextContextType = {
  ibcDenoms: Option<IbcDenomsArr>;
  traseDenom: TraseDenomFuncType;
};

const valueContext = {
  ibcDenoms: undefined,
  traseDenom: () => {},
};

const IbcDenomContext =
  React.createContext<IbcDenomContextContextType>(valueContext);

export function useIbcDenom() {
  return useContext(IbcDenomContext);
}

function IbcDenomProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const poolsData = usePoolListInterval();
  const [ibcDenoms, setIbcDenoms] = useState<Option<IbcDenomsArr>>(undefined);

  useEffect(() => {
    const getIBCDenomData = async () => {
      if (!queryClient) {
        return;
      }

      const response = await queryClient.allDenomTraces();
      const ibcData = {};

      const { denomTraces } = response;
      denomTraces.forEach((item) => {
        const { path, baseDenom } = item;
        const ibcDenomHash = getDenomHash(path, baseDenom);

        // sourceChannelId
        const parts = path.split('/');
        const removetr = parts.filter((itemStr) => itemStr !== 'transfer');
        const sourceChannelId = removetr.join('/');

        ibcData[ibcDenomHash] = {
          sourceChannelId,
          baseDenom,
          ibcDenom: ibcDenomHash,
        };
      });

      if (Object.keys(ibcData).length > 0) {
        setIbcDenoms(ibcData);
      }
    };
    getIBCDenomData();
  }, [queryClient]);

  const traseDenom = useCallback<TraseDenomFuncType>(
    (denomTrase: string) => {
      const infoDenomTemp: TraseDenomFuncResponse = {
        denom: denomTrase,
        coinDecimals: 0,
        path: '',
        coinImageCid: '',
        native: true,
      };
      let findDenom = '';
      // console.log('poolsData', poolsData)

      if (denomTrase.includes('pool') && poolsData) {
        const findPool = findPoolDenomInArr(denomTrase, poolsData);
        if (findPool) {
          const { reserveCoinDenoms } = findPool;
          const denomA = traseDenom(reserveCoinDenoms[0]);
          const denomB = traseDenom(reserveCoinDenoms[1]);
          return [...denomA, ...denomB];
        }
      } else if (!isNative(denomTrase)) {
        if (
          ibcDenoms &&
          Object.prototype.hasOwnProperty.call(ibcDenoms, denomTrase)
        ) {
          const { baseDenom, sourceChannelId: sourceChannelIFromPath } =
            ibcDenoms[denomTrase];
          findDenom = baseDenom;

          infoDenomTemp.native = false;

          const denomInfoFromList = findDenomInTokenList(findDenom);
          if (denomInfoFromList !== null) {
            const { denom, coinDecimals, coinImageCid, counterpartyChainId } =
              denomInfoFromList;
            infoDenomTemp.denom = denom;
            infoDenomTemp.coinDecimals = coinDecimals;
            infoDenomTemp.coinImageCid = coinImageCid || '';
            infoDenomTemp.path = `${counterpartyChainId}/${sourceChannelIFromPath}`;
          } else {
            infoDenomTemp.denom = baseDenom;
            infoDenomTemp.path = sourceChannelIFromPath;
          }
        }
      } else {
        findDenom = denomTrase;
        const denomInfoFromList = findDenomInTokenList(denomTrase);
        if (denomInfoFromList !== null) {
          const { denom, coinDecimals } = denomInfoFromList;
          infoDenomTemp.denom = denom;
          infoDenomTemp.coinDecimals = coinDecimals;
        } else {
          infoDenomTemp.denom = denomTrase.toUpperCase();
        }
      }

      return [{ ...infoDenomTemp }];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ibcDenoms, poolsData]
  );

  return (
    <IbcDenomContext.Provider
      value={useMemo(
        () => ({ ibcDenoms, traseDenom }),
        [ibcDenoms, traseDenom]
      )}
    >
      {children}
    </IbcDenomContext.Provider>
  );
}

export default IbcDenomProvider;
