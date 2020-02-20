import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import TableTxs from '../account/tableTxs';
import { Loading, Dots } from '../../components';
import { formatNumber } from '../../utils/utils';

function useUptime({ accountUser }) {
  const GET_CHARACTERS = gql`
    query uptime {
      pre_commit(
        where: {
          validator: {
            consensus_pubkey: {
              _eq: "${accountUser}"
            }
          }
        }
        order_by: { height: asc }
        limit: 1
      ) {
        height
      }
      pre_commit_aggregate(
        where: {
          validator: {
            consensus_pubkey: {
              _eq: "${accountUser}"
            }
          }
        }
      ) {
        aggregate {
          count(distinct: true)
        }
      }
      block_aggregate(limit: 1, order_by: { height: desc }) {
        nodes {
          height
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_CHARACTERS);
  if (loading) {
    return <Dots />;
  }
  if (error) {
    return `Error! ${error.message}`;
  }

  const {
    block_aggregate: blockAggregate,
    pre_commit_aggregate: preCommitAggregate,
    pre_commit: preCommit,
  } = data;

  const thisBlock = blockAggregate.nodes[0].height;
  const firstPreCommit = preCommit[0].height;
  const countPreCommit = preCommitAggregate.aggregate.count;
  let uptime = 0;

  uptime = countPreCommit / (thisBlock - firstPreCommit);

  return `${formatNumber(uptime * 100, 2)} %`;
}

export default useUptime;
