import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
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

    return formatNumber(data.transaction_aggregate.aggregate.count);
  } catch (error) {
    return '∞';
  }
}

export default Txs;
