import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import bech32 from 'bech32';
import InformationBlock from './informationBlock';
import TableTxs from '../account/component/tableTxs';
import { CardTemplate } from '../../components';
import ActionBarContainer from '../Search/ActionBarContainer';

const GET_CHARACTERS = gql`
  query MyQuery($blockId: bigint) {
    block(where: { height: { _eq: $blockId } }) {
      hash
      height
      proposer_address
      timestamp
      transactions {
        messages
        hash
        success
      }
    }
  }
`;

function BlockDetails({ match }) {
  const { idBlock } = match.params;
  const { loading, error, data } = useQuery(GET_CHARACTERS, {
    variables: {
      blockId: idBlock,
    },
  });
  if (loading) {
    return 'Loading...';
  }
  if (error) {
    return `Error! ${error.message}`;
  }
  console.log(data);

  // useEffect(() => {

  // }, [idBlock]);

  return (
    <div>
      <main className="block-body">
        <InformationBlock
          numbTx={data.block[0].transactions}
          marginBottom={20}
          data={data.block[0]}
        />
        <CardTemplate title="Transactions">
          <TableTxs data={data.block[0].transactions} />
        </CardTemplate>
      </main>
      <ActionBarContainer valueSearchInput={idBlock} keywordHash={idBlock} />
    </div>
  );
}

export default BlockDetails;
