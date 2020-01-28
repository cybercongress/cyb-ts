import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import AppRouter from './router';

import './style/main.css';
import './image/favicon.ico';

const root = document.getElementById('root');

const client = new ApolloClient({
  uri: 'https://titan.cybernode.ai/graphql/v1/graphql', //URL of the GraphQL server
  request: operation => {
    const token = localStorage.getItem('token');
    operation.setContext({
      headers: {
        'content-type': 'application/json',
        'x-hasura-admin-secret': token,
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
});

const render = () => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <AppContainer>
        <AppRouter />
      </AppContainer>
    </ApolloProvider>,
    root
  );
};

render(AppRouter);

if (module.hot) {
  module.hot.accept('./router', () => {
    render(AppRouter);
  });
}
