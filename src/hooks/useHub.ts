import { CyberClient } from '@cybercongress/cyber-js';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { Option } from 'src/types';
import { Channel, Network, Token } from 'src/types/hub';
import { CYBER, HUB_CONTRACTS } from 'src/utils/config';

type ObjectKey<T> = {
  [key: string]: T;
};

const enum TypeFetcher {
  NETWORKS = 'NETWORKS',
  TOKENS = 'TOKENS',
  CHANNELS = 'CHANNELS',
}

const QUERY_MSG = {
  get_entries: {},
};

const fetcher = (client: Option<CyberClient>, type: TypeFetcher) => {
  if (!client) {
    return undefined;
  }

  return client.queryContractSmart(HUB_CONTRACTS[type], QUERY_MSG);
};

export function useNetworks() {
  const queryClient = useQueryClient();
  const [networks, setNetworks] =
    useState<Option<ObjectKey<Network>>>(undefined);
  const { data } = useQuery(
    ['hub-networks'],
    () => fetcher(queryClient, TypeFetcher.NETWORKS),
    {
      enabled: Boolean(queryClient),
    }
  );

  useEffect(() => {
    const objectMappedResult: ObjectKey<Network> = {};
    if (data) {
      data.entries.forEach((row: Network) => {
        objectMappedResult[row.chain_id] = row;
      });
    }
    setNetworks(objectMappedResult);
  }, [data]);

  return { networks };
}

export function useTokens() {
  const queryClient = useQueryClient();
  const [tokens, setTokens] = useState<Option<ObjectKey<Token>>>(undefined);
  const { data } = useQuery(
    ['hub-tokens'],
    () => fetcher(queryClient, TypeFetcher.TOKENS),
    {
      enabled: Boolean(queryClient),
    }
  );

  useEffect(() => {
    const objectMappedResult: ObjectKey<Token> = {};
    if (data) {
      data.entries.forEach((row: Token) => {
        if (row.chain_id === CYBER.CHAIN_ID) {
          const { contract } = row;
          const ticker =
            contract.indexOf('native') !== -1
              ? contract.replace('native/', '')
              : contract;
          objectMappedResult[ticker] = row;
        }
      });

      console.log('Contract tokens ', objectMappedResult);
    }
  }, [data]);

  return { tokens };
}

export function useChannels() {
  const queryClient = useQueryClient();
  const [channels, setChannels] =
    useState<Option<ObjectKey<Channel>>>(undefined);
  const { data } = useQuery(
    ['hub-channels'],
    () => fetcher(queryClient, TypeFetcher.CHANNELS),
    {
      enabled: Boolean(queryClient),
    }
  );

  useEffect(() => {
    const objectMappedResult: ObjectKey<Channel> = {};
    if (data) {
      data.entries.forEach((row: Channel) => {
        if (row.active === 'true') {
          objectMappedResult[row.destination_chain_id] = row;
        }
      });
      setChannels(objectMappedResult);
    }
  }, [data]);

  return { channels };
}
