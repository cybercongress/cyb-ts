import React from 'react';
import gql from 'graphql-tag';
import { useSubscription } from '@apollo/react-hooks';
import TableTxs from './tableTxs';
import { Dots } from '../../../../components';
import styles from './styles.scss';


export default function GetTxs({ accountUser }) {
  const GET_CHARACTERS = gql`
    subscription MyQuery {
      _transaction(
        order_by: { height: desc },
        where: {
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
      ) {
        hash
        height
        memo
        type
        success
        messages
      }
    }
  `;
  const { loading, error, data: dataTxs } = useSubscription(GET_CHARACTERS);

  if (error) {
    return `Error! ${error.message}`;
  }

  if (loading) {
    return <Dots />;
  }

  console.log('data wss', dataTxs);

  const { _transaction: transaction } = dataTxs;

  return (
    <div className={styles.teleportOperationsHistory}>
      {loading ? (
        <div className="container-loading">
          <Dots />
        </div>
      ) : (
        <TableTxs accountUser={accountUser} data={transaction} />
      )}
    </div>
  );
}
