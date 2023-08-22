import { Coin } from '@cosmjs/launchpad';
import { Log } from '@cosmjs/stargate/build/logs';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { parseEventsEndBlockEvents, parseEventsTxsSwap } from '../utils';

type endBlockEventsState = {
  batchIndex: string | undefined;
  exchangedDemandCoinAmount: string | undefined;
  success: undefined | string | 'success' | 'failure';
};

function useGetBlockResults(height: number) {
  const [endBlockEvents, setEndBlockEvents] = useState<
    endBlockEventsState[] | undefined
  >(undefined);
  const api = useQueryClient();
  const { data } = useQuery(
    ['getBlockResults', height],
    () => {
      return api?.getBlockResults(height);
    },
    {
      enabled: Boolean(api && height),
    }
  );

  useEffect(() => {
    if (data) {
      const { endBlockEvents } = data;
      if (endBlockEvents) {
        const resultParseEndBlockEvents =
          parseEventsEndBlockEvents(endBlockEvents);

        if (resultParseEndBlockEvents) {
          setEndBlockEvents(resultParseEndBlockEvents);
        }
      }
    }
  }, [data]);

  return endBlockEvents;
}

type ResultSwap = {
  success: endBlockEventsState['success'];
  demandCoin: Coin;
};

function useGetResultSwap(height: number, logs: Log[]) {
  const data = useGetBlockResults(height);
  const [resultSwap, setResultSwap] = useState<ResultSwap | undefined>(
    undefined
  );

  const resultparseEventsTxs = useMemo(() => {
    return parseEventsTxsSwap(logs);
  }, [logs]);

  useEffect(() => {
    if (data && resultparseEventsTxs) {
      const { batchIndex, demandCoinDenom } = resultparseEventsTxs;

      const findBatch = data.find(
        (item) =>
          item.batchIndex &&
          parseFloat(item.batchIndex) === parseFloat(batchIndex)
      );

      if (findBatch) {
        const demandCoin = {
          denom: demandCoinDenom,
          amount: findBatch.exchangedDemandCoinAmount || '0',
        };

        setResultSwap({
          success: findBatch.success,
          demandCoin,
        });
      }
    }
  }, [data, resultparseEventsTxs]);

  return resultSwap;
}

export default useGetResultSwap;
