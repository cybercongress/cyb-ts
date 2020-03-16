import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Lifetime from './lifetime';

const BLOCK_SUBSCRIPTION = gql`
  subscription newBlock {
    block(limit: 1, order_by: { height: desc }) {
      height
    }
  }
`;

function LifetimeHooks({ validatorAddress, won }) {
  const GET_CHARACTERS = gql`
    query uptime {
      pre_commit_aggregate(
        where: {
          validator: {
            consensus_pubkey: {
              _eq: "cybervalconspub1zcjduepqz4dnk3702wsrksnfsdv3adz97rzcysu8w7a3et2pyvswpce909hsgyshz6"
            }
          }
        }
      ) {
        aggregate {
          count(distinct: true)
        }
      }
    }
  `;
  const { subscribeToMore, ...result } = useQuery(GET_CHARACTERS);

  return (
    <Lifetime
      {...result}
      won={won}
      subscribeToNewComments={() =>
        subscribeToMore({
          document: BLOCK_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }

            const newFeedItem = subscriptionData.data;
            const dataSubscribe = {
              ...prev,
              entry: {
                data: [newFeedItem, prev.pre_commit_aggregate],
              },
            };
            return dataSubscribe;
          },
        })
      }
    />
  );
}

export default LifetimeHooks;
