import React, { useEffect, useState } from 'react';
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
        height
        success
      }
    }
  }
`;

const initialState = {
  height: null,
  timestamp: null,
  hash: null,
  transactions: [],
};

function BlockDetails({ match }) {
  const { idBlock } = match.params;
  const [blockInfo, setBlockInfo] = useState(initialState);
  const { loading, error, data } = useQuery(GET_CHARACTERS, {
    variables: {
      blockId: idBlock,
    },
  });

  useEffect(() => {
    console.log(`data`, data);
    if (data && data.block && Object.keys(data.block).length > 0) {
      setBlockInfo(data.block[0]);
    } else {
      setBlockInfo(initialState);
    }
    return () => setBlockInfo(initialState);
  }, [data, idBlock]);

  if (loading) {
    return 'Loading...';
  }

  if (error) {
    console.log(`Error!`, `Error! ${error.message}`);
  }

  return (
    <div>
      <main className="block-body">
        <InformationBlock
          numbTx={blockInfo.transactions}
          marginBottom={20}
          data={blockInfo}
        />
        <CardTemplate title="Transactions">
          <TableTxs data={blockInfo.transactions} />
        </CardTemplate>
      </main>
      <ActionBarContainer valueSearchInput={idBlock} keywordHash={idBlock} />
    </div>
  );
}

export default BlockDetails;
