import React from 'react';
import gql from 'graphql-tag';
import { useSubscription } from '@apollo/react-hooks';
import TableTxs from '../account/tableTxs';
import { Loading } from '../../components';

const typeTx = `["cosmos-sdk/MsgDeposit", "cosmos-sdk/MsgVote", "cosmos-sdk/MsgSubmitProposal" ]`;

function Leadership({ accountUser }) {
  const GET_CHARACTERS = gql`
    subscription MyQuery {
      transaction(
        order_by: { height: desc }
        where: {
          _and: [
            { messagesByTxhash: { type: { _in: ${typeTx} } } }
            { subject: { _eq: "${accountUser}" } }
          ]
        }
      ) {
        messages
        txhash
        timestamp
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
        <TableTxs accountUser={accountUser} data={dataTxs.transaction} />
      )}
    </div>
  );
}

export default Leadership;
