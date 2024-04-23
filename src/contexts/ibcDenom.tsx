import React, { useCallback, useContext, useMemo } from 'react';
import usePoolListInterval from 'src/hooks/usePoolListInterval';
import { Option } from 'src/types';
import {
  IbcDenomsArr,
  TracesDenomFuncResponse,
  TracesDenomFuncType,
} from 'src/types/ibc';
import {
  findDenomInTokenList,
  findPoolDenomInArr,
  isNative,
} from 'src/utils/utils';
import { useHub } from './hub';
import coinDecimalsConfig from 'src/utils/configToken';
import useAllDenomTraces from 'src/hooks/useAllDenomTraces';

type IbcDenomContextContextType = {
  ibcDenoms: Option<IbcDenomsArr>;
  tracesDenom: TracesDenomFuncType;
};

const valueContext = {
  ibcDenoms: undefined,
  tracesDenom: () => [],
};

const IbcDenomContext =
  React.createContext<IbcDenomContextContextType>(valueContext);

export function useIbcDenom() {
  return useContext(IbcDenomContext);
}

function IbcDenomProvider({ children }: { children: React.ReactNode }) {
  const poolsData = usePoolListInterval();
  const allDenomTraces = useAllDenomTraces();

  const tracesDenom = useCallback<TracesDenomFuncType>(
    (denomTraces: string): TracesDenomFuncResponse[] => {
      const infoDenomTemp: TracesDenomFuncResponse = {
        denom: denomTraces,
        coinDecimals: 0,
        path: '',
        coinImageCid: '',
        native: true,
      };

      if (denomTraces.includes('pool') && poolsData) {
        const findPool = findPoolDenomInArr(denomTraces, poolsData);
        if (findPool) {
          const { reserveCoinDenoms } = findPool;
          const denomA = tracesDenom(reserveCoinDenoms[0]);
          const denomB = tracesDenom(reserveCoinDenoms[1]);
          return [...denomA, ...denomB];
        }
      }

      if (!denomTraces.includes('pool') && coinDecimalsConfig[denomTraces]) {
        const { denom, coinDecimals } = coinDecimalsConfig[denomTraces];
        infoDenomTemp.denom = denom;
        infoDenomTemp.coinDecimals = coinDecimals || 0;
      } else {
        infoDenomTemp.denom = denomTraces.toUpperCase();
      }

      if (
        !isNative(denomTraces) &&
        allDenomTraces &&
        allDenomTraces[denomTraces]
      ) {
        const { baseDenom, sourceChannelId: sourceChannelIFromPath } =
          allDenomTraces[denomTraces];
        infoDenomTemp.native = false;

        const denomInfoFromList = findDenomInTokenList(baseDenom);
        if (denomInfoFromList) {
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

      return [{ ...infoDenomTemp }];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allDenomTraces, poolsData]
  );

  const value = useMemo(
    () => ({ ibcDenoms: allDenomTraces, tracesDenom }),
    [allDenomTraces, tracesDenom]
  );

  return (
    <IbcDenomContext.Provider value={value}>
      {children}
    </IbcDenomContext.Provider>
  );
}

export default IbcDenomProvider;
