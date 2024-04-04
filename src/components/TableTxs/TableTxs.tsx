import InfiniteScroll from 'react-infinite-scroll-component';
import { MessagesByAddressQuery } from 'src/generated/graphql';
import { useMemo } from 'react';
import statusTrueImg from 'src/image/ionicons_svg_ios-checkmark-circle.svg';
import statusFalseImg from 'src/image/ionicons_svg_ios-close-circle.svg';
import { getNowUtcTime, timeSince, trimString } from 'src/utils/utils';
import { Link } from 'react-router-dom';
import { routes } from 'src/routes';
import Display from '../containerGradient/Display/Display';
import Table from '../Table/Table';
import { Dots } from '../ui/Dots';
import TextTable from '../text/textTable';
import MsgType from '../msgType/msgType';

type Props = {
  hasMore: boolean;
  fetchMoreData: () => void;
  data: MessagesByAddressQuery | undefined;
  accountUser: string;
};

enum ColumnsTable {
  status = 'status',
  type = 'type',
  timestamp = 'timestamp',
  tx = 'tx',
  action = 'action',
}

function TableTxs({ hasMore, fetchMoreData, data, accountUser }: Props) {
  const tableData = useMemo(() => {
    return data?.messages_by_address.map((item) => {
      let typeTx = item.type;
      if (
        typeTx.includes('MsgSend') &&
        item?.value?.to_address === accountUser
      ) {
        typeTx = 'Receive';
      }
      const timeAgoInMS =
        getNowUtcTime() - Date.parse(item.transaction.block.timestamp);

      return {
        [ColumnsTable.status]: (
          <TextTable>
            <img
              style={{ width: '20px', height: '20px', marginRight: '5px' }}
              src={item.transaction.success ? statusTrueImg : statusFalseImg}
              alt="status"
            />
          </TextTable>
        ),
        [ColumnsTable.type]: (
          <div style={{ maxWidth: '100px' }}>
            <MsgType type={typeTx} />
          </div>
        ),
        [ColumnsTable.timestamp]: (
          <TextTable>{timeSince(timeAgoInMS)} ago</TextTable>
        ),
        [ColumnsTable.tx]: (
          <TextTable>
            <Link to={routes.txExplorer.getLink(item.transaction_hash)}>
              {trimString(item.transaction_hash, 6, 6)}
            </Link>
          </TextTable>
        ),
        // [ColumnsTable.action]: (),
      };
    });
  }, []);

  return (
    <Display noPaddingX>
      <InfiniteScroll
        dataLength={(data?.messages_by_address || []).length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <p>
            Loading <Dots />
          </p>
        }
        style={{ display: 'grid', gap: '15px' }}
      >
        <Table
          data={tableData}
          columns={Object.values(ColumnsTable).map((item) => ({
            header: item,
            accessorKey: item,
            cell: (info) => info.getValue(),
          }))}
        />
      </InfiniteScroll>
    </Display>
  );
}

export default TableTxs;
