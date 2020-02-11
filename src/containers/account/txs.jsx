import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useSubscription } from '@apollo/react-hooks';
import TableTxs from './tableTxs';
import { CardTemplate, Loading } from '../../components';

export default function GetTxs({ accountUser }) {
  const GET_CHARACTERS = gql`
  subscription MyQuery {
    transaction(where: {message: {subject: {_eq: "${accountUser}"}}}
    order_by: { height: desc }
    ) {
      txhash
      code
      timestamp
      height
      message {
        type
      }
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
        <TableTxs data={dataTxs.transaction} />
      )}
    </CardTemplate>
  );
}
