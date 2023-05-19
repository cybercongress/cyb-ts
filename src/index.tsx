// eslint-disable-next-line import/no-unused-modules
import 'core-js/stable';
import 'regenerator-runtime/runtime';
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

import './style/main.css';
import './style/index.scss';
import './image/favicon.ico';

// for bootloading
import './image/robot.svg';

import IpfsProvider from './contexts/ipfs';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import ErrorScreen from './components/ErrorBoundary/ErrorScreen/ErrorScreen';
import SdkQueryClientProvider from './contexts/queryClient';
import SigningClientProvider from './contexts/signerClient';
import DataProvider from './contexts/appData';
import WebsocketsProvider from './websockets/context';
import DeviceProvider from './contexts/device';
import IbcDenomProvider from './contexts/ibcDenom';
import NetworksProvider from './contexts/networks';
import { Helmet } from 'react-helmet';

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

const container: HTMLElement | null = document.getElementById('root');

if (container === null) {
  throw new Error('Root container missing in index.html');
}

const root = createRoot(container);

// for Storybook, WIP
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <IpfsProvider>
        <NetworksProvider>
          <SdkQueryClientProvider>
            <SigningClientProvider>
              <QueryClientProvider client={queryClient}>
                <IbcDenomProvider>
                  <WebsocketsProvider>
                    <DataProvider>
                      <ApolloProvider client={client}>
                        <DeviceProvider>
                          <ErrorBoundary fallback={<ErrorScreen />}>
                            {children}
                          </ErrorBoundary>
                        </DeviceProvider>
                      </ApolloProvider>
                    </DataProvider>
                  </WebsocketsProvider>
                </IbcDenomProvider>
              </QueryClientProvider>
            </SigningClientProvider>
          </SdkQueryClientProvider>
        </NetworksProvider>
      </IpfsProvider>
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
      <ReactQueryDevtools />
    </>
  </Providers>
);
