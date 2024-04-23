import { useMemo } from 'react';

import { trimString } from 'src/utils/utils';
import { Link } from 'react-router-dom';
import { routes } from 'src/routes';
import Table from '../../Table/Table';
import TextTable from '../../text/textTable';
import MsgTypeTxs from './MsgTypeTxs';
import CreatedAt from '../../CreatedAt/CreatedAt';
import RenderValue from './RenderValue';
import styles from './TableDataTxs.module.scss';
import StatusTxs from './StatusTxs';
import TxHash from './txHash';

type MessagesData = {
  type: string;
  value: any;
  transaction_hash: string;
  transaction: {
    success: boolean;
    block: {
      timestamp: string;
    };
  };
};

type Props = {
  accountUser: string;
  data: Array<MessagesData>;
  loading: boolean;
};

enum ColumnsTable {
  status = 'status',
  type = 'type',
  timestamp = 'timestamp',
  tx = 'tx',
  action = 'action',
}

function TableDataTxs({ data, loading, accountUser }: Props) {
  const tableData = useMemo(() => {
    return data?.map((item) => {
      return {
        [ColumnsTable.status]: (
          <TextTable>
            <StatusTxs success={item.transaction.success} />
          </TextTable>
        ),
        [ColumnsTable.type]: (
          <div className={styles.type}>
            <MsgTypeTxs
              type={item.type}
              value={item.value}
              accountUser={accountUser}
            />
          </div>
        ),
        [ColumnsTable.timestamp]: (
          <TextTable>
            <CreatedAt timeAt={item.transaction.block.timestamp} />
          </TextTable>
        ),
        [ColumnsTable.tx]: (
          <TextTable>
            <TxHash hash={item.transaction_hash} />
          </TextTable>
        ),
        [ColumnsTable.action]: (
          <TextTable display="flex">
            <RenderValue
              value={item.value}
              type={item.type}
              accountUser={accountUser}
            />
          </TextTable>
        ),
      };
    });
  }, [data, accountUser]);

  return (
    <Table
      isLoading={loading}
      data={tableData || []}
      columns={Object.values(ColumnsTable).map((item) => ({
        header: item,
        accessorKey: item,
        cell: (info) => info.getValue(),
      }))}
    />
  );
}

export default TableDataTxs;
