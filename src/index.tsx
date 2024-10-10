// eslint-disable-next-line import/no-unused-modules
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { createRoot } from 'react-dom/client';

import { ApolloProvider } from '@apollo/client';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import AppRouter from './router';
import store from './redux/store';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

import './style/main.css';
import './style/index.scss';
import './image/favicon.ico';

// for boot loading
import './image/robot.svg';

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

import ScriptingProvider from './contexts/scripting/scripting';
import { localStorageKeys } from './constants/localStorageKeys';
import CyberClientProvider from './contexts/queryCyberClient';
import apolloClient from './services/graphql';

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
            <CyberClientProvider>
              <SigningClientProvider>
                <HubProvider>
                  <IbcDenomProvider>
                    <WebsocketsProvider>
                      <DataProvider>
                        <ApolloProvider client={apolloClient}>
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
            </CyberClientProvider>
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
