import React from 'react';
import gql from 'graphql-tag';
import { useSubscription } from '@apollo/react-hooks';
import TableTxs from './tableTxs';
import { CardTemplate, Loading } from '../../components';

export default function GetTxs({ accountUser }) {
  const GET_CHARACTERS = gql`
  subscription MyQuery {
    message(where: {_or: [
      {value: {_contains: {to_address: "${accountUser}"}}}, 
      {value: {_contains: {from_address: "${accountUser}"}}},
      {subject: {_eq: "${accountUser}"}}, 
    ]} 
      order_by: { height: desc }) {
      txhash
      type
      height
      timestamp
      transaction {
        code
      }
      subject
    }
  }
  `;
  const { loading, error, data: dataTxs } = useSubscription(GET_CHARACTERS);

  if (error) {
    return `Error! ${error.message}`;
  }

  console.log('data wss', dataTxs);

  return (
    <CardTemplate paddingBottom={10} title="Txs">
      {loading ? (
        <div className="container-loading">
          <Loading />
        </div>
      ) : (
        <TableTxs accountUser={accountUser} data={dataTxs.message} />
      )}
    </CardTemplate>
  );
}
