import React from 'react';
import gql from 'graphql-tag';
import { useSubscription } from '@apollo/react-hooks';
import TableTxs from './tableTxs';
import { Loading } from '../../components';

/*
  subscription MyQuery {
    transaction(order_by: {block: {height: desc}}, where: {_or: [{
      subject: {_eq: "${accountUser}"}}, 
      {messagesByTxhash: {value: 
        {_contains: {to_address: "${accountUser}"}
      }}}]}
    ) {
      txhash
      code
      timestamp
      subject
      messages
    }
  }
*/

export default function GetTxs({ accountUser }) {
  const GET_CHARACTERS = gql`
  subscription MyQuery {
    transaction(order_by: {block: {height: desc}}, where: {_or: [{
      subject: {_eq: "${accountUser}"}}, 
      {messagesByTxhash: {value: 
        {_contains: {to_address: "${accountUser}"}
      }}}]}
    ) {
      txhash
      code
      timestamp
      subject
      messages
    }
  }
  `;
  const { loading, error, data: dataTxs } = useSubscription(GET_CHARACTERS);

  if (error) {
    return `Error! ${error.message}`;
  }

  console.log('data wss', dataTxs);

  return (
    <div>
      {loading ? (
        <div className="container-loading">
          <Loading />
        </div>
      ) : (
        <TableTxs accountUser={accountUser} data={dataTxs.transaction} />
      )}
    </div>
  );
}
