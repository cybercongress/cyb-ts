import React from 'react';
import gql from 'graphql-tag';
import { useSubscription } from '@apollo/react-hooks';

const GET_CHARACTERS = gql`
  subscription MyQuery {
    block(limit: 1, order_by: { height: desc }) {
      height
    }
  }
`;

function DontReadTheComments() {
  const { loading, error, data } = useSubscription(GET_CHARACTERS);

  if (loading) {
    return 'Loading...';
  }
  if (error) {
    console.log('error', error);
    console.log('data', data);
    return `Error! ${error.message}`;
  }

  console.log('data wss', data);

  return <div>ok</div>;
}

export default DontReadTheComments;
