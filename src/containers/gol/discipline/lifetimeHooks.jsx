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

function LifetimeHooks({ consensusAddress, won }) {
  const GET_CHARACTERS = gql`
    query lifetimeRate {
      validator(
        where: {
          consensus_pubkey: {
            _eq: "${consensusAddress}"
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
  if (consensusAddress === null) {
    return <Lifetime dataQ={null} won={won} />;
  }
  const { loading, data: dataQ } = useQuery(GET_CHARACTERS);

  if (loading) {
    return <Dots />;
  }
  return <Lifetime dataQ={dataQ} won={won} />;
}

export default LifetimeHooks;
