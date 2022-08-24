import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { AppContainer } from 'react-hot-loader';
import ApolloClient from 'apollo-client';
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
// import './style/index.scss';
import './image/favicon.ico';

const getHeaders = (token) => {
  const headers = {
    'content-type': 'application/json',
    'x-hasura-admin-secret': 'token',
    authorization: token ? `Bearer ${token}` : '',
  };
  return headers;
};

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

const container = document.getElementById('root');
const root = createRoot(container);

const render = () => {
  root.render(
    <>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <AppContextProvider>
            <AppContainer>
              <AppRouter />
            </AppContainer>
          </AppContextProvider>
        </ApolloProvider>
      </Provider>
    </>
  );
};

render(AppRouter);

if (module.hot) {
  module.hot.accept('./router', () => {
    render(AppRouter);
  });
}
