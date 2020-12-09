import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import TableTxs from './tableTxs';
import { Loading, Dots } from '../../components';
import { formatNumber } from '../../utils/utils';

function CyberLinkCount({ accountUser }) {
  try {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const GET_CHARACTERS = gql`
   query cyberlink {
    cyberlink_aggregate(where: {subject: {_eq: "${accountUser}"}}) {
      aggregate {
        count
      }
    }
  }
  `;
    const { loading: loadingQ, error, data } = useQuery(GET_CHARACTERS);

    useEffect(() => {
      if (!loadingQ) {
        if (data.cyberlink_aggregate.aggregate.count) {
          setCount(data.cyberlink_aggregate.aggregate.count);
          setLoading(false);
        }
      }
    }, [data, loadingQ]);

    if (loading) {
      return <Dots />;
    }

    return count;
  } catch (error) {
    console.warn(error);
    return '∞';
  }
}

export default CyberLinkCount;
