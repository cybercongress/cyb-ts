import React, { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Link } from 'react-router-dom';
import statusTrueImg from 'src/image/ionicons_svg_ios-checkmark-circle.svg';
import statusFalseImg from 'src/image/ionicons_svg_ios-close-circle.svg';
import Table from 'src/components/Table/Table';
import { useRobotContext } from 'src/pages/robot/robot.context';
import Display from 'src/components/containerGradient/Display/Display';
import { MsgType, TextTable } from '../../../../../components';
import {
  getNowUtcTime,
  timeSince,
  trimString,
} from '../../../../../utils/utils';
import RenderValue from './RenderValue';

import useGetTsxByAddress from '../hooks/useGetTsxByAddress';
import { useAdviser } from 'src/features/adviser/context';

function TxsTable() {
  const { address: accountUser } = useRobotContext();
  const dataGetTsxByAddress = useGetTsxByAddress(accountUser);

  const { setAdviser } = useAdviser();

  useEffect(() => {
    setAdviser(
      <>
        the life history of one neuron, which cannot be removed or destroyed{' '}
        <br />
        what is written in the blockchain cannot be cut out with an axe
      </>
    );
  }, [setAdviser]);

  const { data, error, status, isFetching, fetchNextPage, hasNextPage } =
    dataGetTsxByAddress;

  let validatorRows = [];

  if (data) {
    validatorRows = data?.pages?.map((page) => {
      return page.data.map((item) => {
        let timeAgoInMS = null;
        const time =
          getNowUtcTime() - Date.parse(item.transaction.block.timestamp);
        if (time > 0) {
          timeAgoInMS = time;
        }

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
                style={{
                  width: '20px',
                  height: '20px',
                  marginRight: '5px',
                }}
                src={item.transaction.success ? statusTrueImg : statusFalseImg}
                alt="statusImg"
              />
            </TextTable>
          ),
          type: (
            <div
              style={{
                maxWidth: '100px',
              }}
            >
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
    });
  }

  const fetchNextPageFnc = () => {
    setTimeout(() => {
      fetchNextPage();
    }, 250);
  };

  const columns = React.useMemo(
    () => [
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
    ],
    []
  );

  const tableData = React.useMemo(
    () =>
      validatorRows.reduce((acc, value) => {
        return acc.concat(value);
      }, []),
    [validatorRows]
  );

  return (
    <Display noPaddingX>
      <InfiniteScroll
        dataLength={Object.keys(validatorRows).length}
        next={fetchNextPageFnc}
        style={{ display: 'grid', gap: '15px' }}
        hasMore={hasNextPage}
        // loader={isFetching && <Loader2 />}
      >
        <Table columns={columns} data={tableData} isLoading={isFetching} />
      </InfiniteScroll>

      {status === 'error' && <span>Error: {error.message}</span>}
    </Display>
  );
}

export default TxsTable;
