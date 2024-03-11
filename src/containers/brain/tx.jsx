import { useQuery, gql } from '@apollo/client';

import { Dots } from '../../components';
import { formatNumber } from '../../utils/utils';

const GET_CHARACTERS = gql`
  query MyQuery {
    transaction_aggregate {
      aggregate {
        count(columns: hash)
      }
    }
  }
`;

function Txs() {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { loading, data } = useQuery(GET_CHARACTERS);
    if (loading) {
      return <Dots />;
    }

    return (
      <span>{formatNumber(data.transaction_aggregate.aggregate.count)}</span>
    );
  } catch (error) {
    return <span>∞</span>;
  }
}

export default Txs;
