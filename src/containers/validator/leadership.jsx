import gql from 'graphql-tag';
import { useSubscription } from '@apollo/react-hooks';
import TableTxs from '../account/component/tableTxs';
import { Dots } from '../../components';
import Loader2 from 'src/components/ui/Loader2';

const typeTx = `["cosmos.gov.v1beta1.MsgDeposit", "cosmos.gov.v1beta1.MsgVote", "cosmos.gov.v1beta1.MsgSubmitProposal" ]`;

function Leadership({ accountUser }) {
  const GET_CHARACTERS = gql`
    subscription MyQuery {
      _transaction(
        where: {
          _and: [
            {
              type: {
                _in: ${typeTx}
              }
            }
            {
              _or: [
                {
                  subject1: {
                    _eq: "${accountUser}"
                  }
                }
                {
                  subject2: {
                    _eq: "${accountUser}"
                  }
                }
              ]
            }
          ]
        }
        order_by: { height: desc }
      ) {
        hash
        type
        success
        height
        messages
      }
    }
  `;
  const { loading, error, data } = useSubscription(GET_CHARACTERS);

  const { _transaction: transaction } = data || {};

  return (
    <div>
      {loading ? (
        <Loader2 />
      ) : transaction ? (
        <TableTxs accountUser={accountUser} data={transaction} />
      ) : error ? (
        <p>{error.message}</p>
      ) : (
        'No data'
      )}
    </div>
  );
}

export default Leadership;
