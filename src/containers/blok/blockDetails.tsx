import { useEffect, useMemo, useState } from 'react';
import withRouter from 'src/components/helpers/withRouter';
import { useBlockByHeightQuery } from 'src/generated/graphql';
import InformationBlock from './informationBlock';
import { CardTemplate, TextTable } from '../../components';
import ActionBarContainer from '../Search/ActionBarContainer';
import Table from 'src/components/Table/Table';
import StatusTxs from 'src/components/TableTxsInfinite/component/StatusTxs';
import TxHash from 'src/components/TableTxsInfinite/component/txHash';

const initialState = {
  height: null,
  timestamp: null,
  hash: null,
  transactions: [],
};

enum ColumnsTable {
  status = 'status',
  tx = 'tx',
  messages = 'messages',
}

function BlockDetails({ router }) {
  const { idBlock } = router.params;
  const [blockInfo, setBlockInfo] = useState(initialState);
  const { loading, error, data } = useBlockByHeightQuery({
    variables: {
      blockId: idBlock,
    },
  });
  useEffect(() => {
    if (data && data.block && Object.keys(data.block).length > 0) {
      setBlockInfo(data.block[0]);
    } else {
      setBlockInfo(initialState);
    }
    return () => setBlockInfo(initialState);
  }, [data, idBlock]);

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    console.log(`Error!`, `Error! ${error.message}`);
  }

  const tableData = useMemo(() => {
    return data?.block[0].transactions.map((item) => {
      return {
        [ColumnsTable.status]: (
          <TextTable>
            <StatusTxs success={item.success} />
          </TextTable>
        ),
        [ColumnsTable.messages]: (
          <TextTable>
            {item.messages.length || 0}
          </TextTable>
        ),

        [ColumnsTable.tx]: (
          <TextTable>
            <TxHash hash={item.hash} />
          </TextTable>
        ),
      };
    });
  }, [data]);

  return (
    <div>
      <main className="block-body">
        <InformationBlock
          numbTx={blockInfo.transactions}
          marginBottom={20}
          data={blockInfo}
        />
        <CardTemplate title="Transactions">
          <Table
            data={tableData || []}
            columns={Object.values(ColumnsTable).map((item) => ({
              header: item,
              accessorKey: item,
              cell: (info) => info.getValue(),
            }))}
          />
        </CardTemplate>
      </main>
      <ActionBarContainer valueSearchInput={idBlock} keywordHash={idBlock} />
    </div>
  );
}

export default withRouter(BlockDetails);
