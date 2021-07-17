import React from 'react';
import gql from 'graphql-tag';
import { useSubscription } from '@apollo/react-hooks';
import TableTxs from '../account/component/tableTxs';
import { Dots } from '../../components';

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
  const { loading, error, data: dataTxs } = useSubscription(GET_CHARACTERS);
  if (loading) {
    return <Dots />;
  }

  if (error) {
    return `Error! ${error.message}`;
  }

  console.log('data wss', dataTxs);
  const { _transaction: transaction } = dataTxs;

  return (
    <div>
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

export default Leadership;
