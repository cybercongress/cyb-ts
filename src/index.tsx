import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { OperationDefinitionNode } from 'graphql';

import { createRoot } from 'react-dom/client';
import ApolloClient from 'apollo-client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ApolloProvider } from 'react-apollo';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloLink, split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Provider } from 'react-redux';
import AppRouter from './router';
import { CYBER } from './utils/config';
import store from './redux/store';
import AppContextProvider from './context';

import './style/main.css';
import './image/favicon.ico';
import './image/logo-bulb.svg';

const httpLink = new HttpLink({
  uri: CYBER.CYBER_INDEX_HTTPS,
  headers: {
    'content-type': 'application/json',
    authorization: '',
  },
});

const wsLink = new WebSocketLink({
  uri: CYBER.CYBER_INDEX_WEBSOCKET,
  options: {
    reconnect: true,
  },
});

const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(
      query
    ) as OperationDefinitionNode;
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // staleTime: 60 * 1000,
    },
  },
});

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <AppContextProvider>
        <QueryClientProvider client={queryClient}>
          <AppRouter />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </AppContextProvider>
    </ApolloProvider>
  </Provider>
);
