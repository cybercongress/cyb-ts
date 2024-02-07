import gql from 'graphql-tag';
import { useSubscription } from '@apollo/react-hooks';
import TableTxs from '../../pages/robot/_refactor/account/component/tableTxs';
import { Loading, NoItems } from '../../components';

function Rumors({ accountUser }) {
  const GET_CHARACTERS = gql`
    subscription getRumors {
     transaction(
        order_by: { height: desc }
        where: {
          _and: [
            {
              messagesByTransactionHash: {
                type: {
                  _in: [
                    "cosmos.staking.v1beta1.MsgDelegate"
                    "cosmos.staking.v1beta1.MsgUndelegate"
                  ]
                }
              }
            }
            {
              messagesByTransactionHash: {
                value: {
                  _contains: {
                    validator_address: "${accountUser}"
                  }
                }
              }
            }
          ]
        }
      ) {
        messages
        success
        hash
        height
      }
    }
  `;

  const { loading, error, data: dataTxs } = useSubscription(GET_CHARACTERS);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : dataTxs ? (
        <TableTxs accountUser={accountUser} amount data={dataTxs.transaction} />
      ) : error ? (
        <>{JSON.stringify(error)}</>
      ) : (
        <NoItems text="No data" />
      )}
    </div>
  );
}

export default Rumors;
