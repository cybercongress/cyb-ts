// eslint-disable-next-line import/no-unused-modules
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { OperationDefinitionNode } from 'graphql';

import { createRoot } from 'react-dom/client';

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  split,
  ApolloProvider,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import AppRouter from './router';
import store from './redux/store';

import './style/main.css';
import './style/index.scss';
import './image/favicon.ico';

// for bootloading
import './image/robot.svg';

// import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import SdkQueryClientProvider from './contexts/queryClient';
import SigningClientProvider from './contexts/signerClient';
import DataProvider from './contexts/appData';
import WebsocketsProvider from './websockets/context';
import DeviceProvider from './contexts/device';
import IbcDenomProvider from './contexts/ibcDenom';
import NetworksProvider from './contexts/networks';
import BackendProvider from './contexts/backend/backend';

import AdviserProvider from './features/adviser/context';
import HubProvider from './contexts/hub';

import { INDEX_HTTPS, INDEX_WEBSOCKET } from './constants/config';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

const httpLink = new HttpLink({
  uri: INDEX_HTTPS,
  headers: {
    'content-type': 'application/json',
    authorization: '',
  },
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: INDEX_WEBSOCKET,
  })
);

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

// TODO: replace with @apollo/client
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

const container: HTMLElement | null = document.getElementById('root');

if (container === null) {
  throw new Error('Root container missing in index.html');
}

const root = createRoot(container);

// for Storybook, WIP
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <NetworksProvider>
        <QueryClientProvider client={queryClient}>
          <SdkQueryClientProvider>
            <SigningClientProvider>
              <HubProvider>
                <IbcDenomProvider>
                  <WebsocketsProvider>
                    <DataProvider>
                      <ApolloProvider client={client}>
                        <BackendProvider>
                          <DeviceProvider>
                            <AdviserProvider>
                              <ErrorBoundary>{children}</ErrorBoundary>
                              {/* {children} */}
                            </AdviserProvider>
                          </DeviceProvider>
                        </BackendProvider>
                      </ApolloProvider>
                    </DataProvider>
                  </WebsocketsProvider>
                </IbcDenomProvider>
              </HubProvider>
            </SigningClientProvider>
          </SdkQueryClientProvider>
        </QueryClientProvider>
      </NetworksProvider>
    </Provider>
  );
}

root.render(
  <Providers>
    <>
      <Helmet>
        <title>cyb: your immortal robot for the great web</title>
      </Helmet>
      <AppRouter />
      <ReactQueryDevtools position="bottom-right" />
    </>
  </Providers>
);
