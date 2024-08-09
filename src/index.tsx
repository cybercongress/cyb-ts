/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-unused-modules */
// eslint-disable-next-line import/no-unused-modules
import 'core-js/stable';
import { OperationDefinitionNode } from 'graphql';
import 'regenerator-runtime/runtime';

import { createRoot } from 'react-dom/client';

import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import store from './redux/store';
import AppRouter from './router';

import './image/favicon.ico';
import './style/index.scss';
import './style/main.css';

// for boot loading
import './image/robot.svg';

// import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import DataProvider from './contexts/appData';
import BackendProvider from './contexts/backend/backend';
import DeviceProvider from './contexts/device';
import IbcDenomProvider from './contexts/ibcDenom';
import NetworksProvider from './contexts/networks';
import SdkQueryClientProvider from './contexts/queryClient';
import SigningClientProvider from './contexts/signerClient';
import WebsocketsProvider from './websockets/context';

import HubProvider from './contexts/hub';
import AdviserProvider from './features/adviser/context';

import { INDEX_HTTPS, INDEX_WEBSOCKET } from './constants/config';
import { localStorageKeys } from './constants/localStorageKeys';
import ScriptingProvider from './contexts/scripting/scripting';

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

// temp
localStorage.removeItem(localStorageKeys.settings.adviserAudio);

function Providers({ children }: { children: React.ReactNode }) {
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
                          <ScriptingProvider>
                            <DeviceProvider>
                              <AdviserProvider>
                                <ErrorBoundary>{children}</ErrorBoundary>
                              </AdviserProvider>
                            </DeviceProvider>
                          </ScriptingProvider>
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
