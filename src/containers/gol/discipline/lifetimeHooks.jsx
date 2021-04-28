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

function LifetimeHooks({ consensusAddress, takeoffDonations = 0 }) {
  const GET_CHARACTERS = gql`
    query lifetimeRate {
      pre_commit_view(where: {consensus_pubkey: {_eq: "${consensusAddress}"}}) {
        precommits
      }
      pre_commit_view_aggregate {
        aggregate {
          sum {
            precommits
          }
        }
      }
    }
  `;
  if (consensusAddress === null) {
    return <Lifetime dataQ={null} takeoffDonations={takeoffDonations} />;
  }
  const { loading, data: dataQ } = useQuery(GET_CHARACTERS);

  if (loading) {
    return <Dots />;
  }
  return <Lifetime dataQ={dataQ} takeoffDonations={takeoffDonations} />;
}

export default LifetimeHooks;
