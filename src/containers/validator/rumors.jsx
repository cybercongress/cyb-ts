import React from 'react';
import gql from 'graphql-tag';
import { useSubscription } from '@apollo/react-hooks';
import TableTxs from '../account/tableTxs';
import { Loading } from '../../components';

function Rumors({ accountUser }) {
  const GET_CHARACTERS = gql`
  subscription MyQuery {
    transaction(order_by: {height: desc}, where: {_and: [{messagesByTxhash: {type: {_in: ["cosmos-sdk/MsgDelegate", "cosmos-sdk/MsgUndelegate"]}}}, {messagesByTxhash: {value: {_contains: {validator_address: "${accountUser}"}}}}]}) {
      txhash
      timestamp
      messages
      subject
      code
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
        <TableTxs accountUser={accountUser} amount data={dataTxs.transaction} />
      )}
    </div>
  );
}

export default Rumors;
