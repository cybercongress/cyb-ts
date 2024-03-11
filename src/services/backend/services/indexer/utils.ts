import { ApolloClient, DocumentNode, InMemoryCache } from '@apollo/client';

import {
  GraphQLWsLink,
  Observable as ApolloObservable,
} from '@apollo/client/link/subscriptions';
import { GraphQLClient } from 'graphql-request';
import { createClient } from 'graphql-ws';
import { Observable } from 'rxjs';
import { CYBER_INDEX_HTTPS, CYBER_INDEX_WSS } from 'src/constants/config';

const cyberGraphQLWsLink = new GraphQLWsLink(
  createClient({
    url: CYBER_INDEX_WSS,
    shouldRetry: (errOrCloseEvent: unknown) => true,
    retryAttempts: 10,
    retryWait: async (retries: number): Promise<void> => {
      setTimeout(() => Promise.resolve(), Math.min(1000 * 2 ** retries, 10000));
    },
    // on: {
    //   error: (err) => {
    //     console.log('---ws errr', err);
    //   },
    //   message: (msg) => {
    //     console.log('---ws message', msg);
    //   },
    //   // Handle connection opened event
    //   opened: () => {
    //     console.log('---ws opened');
    //   },
    //   // Handle connection closed event
    //   closed: () => {
    //     console.log('---ws closed');
    //   },
    // },
  })
);

export const createIndexerClient = (abortSignal: AbortSignal) =>
  new GraphQLClient(CYBER_INDEX_HTTPS, {
    signal: abortSignal,
  });

// eslint-disable-next-line import/no-unused-modules
export function createIndexerWebsocket<T>(
  query: DocumentNode,
  variables: object
): Observable<T> {
  const client = new ApolloClient({
    link: cyberGraphQLWsLink,
    cache: new InMemoryCache(),
  });
  const apolloObservable = client.subscribe({ query, variables });
  return new Observable((subscriber) => {
    const subscription = apolloObservable.subscribe({
      next(result) {
        subscriber.next(result.data as T);
      },
      error(err) {
        subscriber.error(err);
      },
      complete() {
        subscriber.complete();
      },
    });

    // Cleanup subscription on unsubscribe
    return () => subscription.unsubscribe();
  });
}
