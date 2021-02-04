import { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useSubscription } from '@apollo/react-hooks';
import ApolloClient from 'apollo-client';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloLink, split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';

const URL_GRAPHQL = 'https://uranus.cybernode.ai/graphql/v1/graphql';
const URL_GRAPHQL_WSS = 'wss://uranus.cybernode.ai/graphql/v1/graphql';

const httpLink = new HttpLink({
  uri: URL_GRAPHQL,
  headers: {
    'content-type': 'application/json',
    authorization: '',
  },
});

const wsLink = new WebSocketLink({
  uri: URL_GRAPHQL_WSS,
  options: {
    reconnect: true,
  },
  headers: {
    'content-type': 'application/json',
    authorization: '',
  },
});

const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
);

const link = ApolloLink.from([terminatingLink]);

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache,
});

const QueryGetTx = gql`
  subscription MyQuery {
    txs_queue {
      av_price
      block
      checked
      cyber
      cyber_hash
      eth
      eth_sum
      eth_txhash
      eul
      eul_sum
      sender
    }
  }
`;

const MarketData = gql`
  subscription MarketData {
    market_data {
      current_price
      eth_donated
      euls_won
      last_price
      market_cap_eth
    }
  }
`;

const useGetTx = () => {
  const { data, loading } = useSubscription(QueryGetTx, { client });
  const [txsData, setTxsData] = useState({ data: [], loading: true });

  useEffect(() => {
    if (!loading) {
      if (data !== null && data.txs_queue) {
        setTxsData({ data: data.txs_queue, loading: false });
      } else {
        setTxsData({ data: [], loading: false });
      }
    }

    return () => {
      setTxsData({ data: [], loading: true });
    };
  }, [data, loading]);

  return txsData;
};

const useGetMarketData = () => {
  const { data, loading } = useSubscription(MarketData, { client });
  const [marketData, setMarketData] = useState({
    currentPrice: 0,
    ethDonated: 0,
    eulsWon: 0,
    lastPrice: 0,
    marketCapEth: 0,
    loading: true,
  });

  useEffect(() => {
    if (!loading) {
      if (data !== null && data.market_data) {
        const market = data.market_data[0];
        setMarketData({
          currentPrice: market.current_price,
          ethDonated: market.eth_donated,
          eulsWon: market.euls_won,
          lastPrice: market.last_price,
          marketCapEth: market.market_cap_eth,
          loading: false,
        });
      } else {
        setMarketData((items) => ({
          ...items,
          loading: false,
        }));
      }
    }

    return () => {
      setMarketData({
        currentPrice: 0,
        ethDonated: 0,
        eulsWon: 0,
        lastPrice: 0,
        marketCapEth: 0,
        loading: true,
      });
    };
  }, [loading, data]);

  return marketData;
};

export { useGetMarketData, useGetTx };
