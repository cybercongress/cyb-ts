import React, { useEffect, useMemo, useState } from 'react';
import { useMessagesByAddressQuery } from 'src/generated/graphql';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import statusTrueImg from 'src/image/ionicons_svg_ios-checkmark-circle.svg';
import statusFalseImg from 'src/image/ionicons_svg_ios-close-circle.svg';
import Table from 'src/components/Table/Table';
import { useRobotContext } from 'src/pages/robot/robot.context';
import Display from 'src/components/containerGradient/Display/Display';
import { MsgType, TextTable } from 'src/components';
import { getNowUtcTime, timeSince, trimString } from 'src/utils/utils';
import { useAdviser } from 'src/features/adviser/context';

import RenderValue from './RenderValue';

const limit = 1000; // Use a constant for the limit

function TxsTable() {
  const { address: accountUser } = useRobotContext();
  const [hasMore, setHasMore] = useState(true);
  const { setAdviser } = useAdviser();
  const { data, loading, fetchMore, error } = useMessagesByAddressQuery({
    variables: {
      address: `{${accountUser}}`,
      limit,
      offset: 0,
      types: '{}'
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    setAdviser(
      <>
        the life history of one neuron, which cannot be removed or destroyed{' '}
        <br />
        what is written in the blockchain cannot be cut out with an axe
      </>
    );
  }, [setAdviser]);

  const fetchMoreData = () => {
    fetchMore({
      variables: {
        offset: data?.messages_by_address.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        setHasMore(fetchMoreResult.messages_by_address.length > 0);
        return {
          ...prev,
          messages_by_address: [
            ...prev.messages_by_address,
            ...fetchMoreResult.messages_by_address,
          ],
        };
      },
    });
  };

  // Prepare data for the table, combining all fetched pages
  const tableData = useMemo(() => {
    return (data?.messages_by_address || []).map((item) => {
      const timeAgoInMS =
        getNowUtcTime() - Date.parse(item.transaction.block.timestamp);

      let typeTx = item.type;
      if (
        typeTx.includes('MsgSend') &&
        item?.value?.to_address === accountUser
      ) {
        typeTx = 'Receive';
      }

      return {
        status: (
          <TextTable>
            <img
              style={{ width: '20px', height: '20px', marginRight: '5px' }}
              src={item.transaction.success ? statusTrueImg : statusFalseImg}
              alt="status"
            />
          </TextTable>
        ),
        type: (
          <div style={{ maxWidth: '100px' }}>
            <MsgType type={typeTx} />
          </div>
        ),
        timestamp: <TextTable>{timeSince(timeAgoInMS)} ago</TextTable>,
        tx: (
          <TextTable>
            <Link to={`/network/bostrom/tx/${item.transaction_hash}`}>
              {trimString(item.transaction_hash, 6, 6)}
            </Link>
          </TextTable>
        ),
        action: (
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
    <Display noPaddingX>
      <InfiniteScroll
        dataLength={(data?.messages_by_address || []).length}
        next={fetchMoreData}
        hasMore={!!hasMore && !loading}
        loader={<p>Loading...</p>}
        style={{ display: 'grid', gap: '15px' }}
      >
        <Table
          columns={[
            {
              header: 'Status',
              accessorKey: 'status',
              cell: (info) => info.getValue(),
            },
            {
              header: 'Type',
              accessorKey: 'type',
              cell: (info) => info.getValue(),
            },
            {
              header: 'Timestamp',
              accessorKey: 'timestamp',
              cell: (info) => info.getValue(),
            },
            {
              header: 'Tx',
              accessorKey: 'tx',
              cell: (info) => info.getValue(),
            },
            {
              header: 'Action',
              accessorKey: 'action',
              cell: (info) => info.getValue(),
            },
          ]}
          data={tableData}
          isLoading={loading}
        />
      </InfiniteScroll>

      {error && <span>Error: {error.message}</span>}
    </Display>
  );
}

export default TxsTable;
