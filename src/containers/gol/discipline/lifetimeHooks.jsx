import React from 'react';
import gql from 'graphql-tag';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import Lifetime from './lifetime';
import { Dots } from '../../../components';

const BLOCK_SUBSCRIPTION = gql`
  subscription newBlock {
    block(limit: 1, order_by: { height: desc }) {
      height
    }
  }
`;

function LifetimeHooks({ validatorAddress, won }) {
  const GET_CHARACTERS = gql`
    query lifetimeRate {
      validator(
        where: {
          consensus_pubkey: {
            _eq: "cybervalconspub1zcjduepqz4dnk3702wsrksnfsdv3adz97rzcysu8w7a3et2pyvswpce909hsgyshz6"
          }
        }
      ) {
        pre_commits_aggregate {
          aggregate {
            count
          }
        }
      }
      pre_commit_aggregate {
        aggregate {
          count
        }
      }
    }
  `;
  const { subscribeToMore, loading, data: dataQ } = useQuery(GET_CHARACTERS);

  if (loading) {
    return <Dots />;
  }
  return (
    <Lifetime
      dataQ={dataQ}
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
                data: [newFeedItem],
              },
            };
            // console.log(dataQ);
            return dataSubscribe;
          },
        })
      }
    />
  );
}

export default LifetimeHooks;
