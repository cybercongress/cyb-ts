/* eslint-disable no-nested-ternary */
import React from 'react';
import { TableEv as Table } from '@cybercongress/gravity';
import InfiniteScroll from 'react-infinite-scroll-component';
import { v4 as uuidv4 } from 'uuid';

import { Link } from 'react-router-dom';
import { Dots, MsgType, NoItems, TextTable } from '../../../components';
import { getNowUtcTime, timeSince, trimString } from '../../../utils/utils';
import statusTrueImg from '../../../image/ionicons_svg_ios-checkmark-circle.svg';
import statusFalseImg from '../../../image/ionicons_svg_ios-close-circle.svg';
import RenderValue from './RenderValue';
import { ContainerGradientText } from '../../../components/containerGradient/ContainerGradient';
import useGetTsxByAddress from '../hooks/useGetTsxByAddress';
import useGetAddressTemp from '../hooks/useGetAddressTemp';
import Loader2 from 'src/components/ui/Loader2';
import Table from 'src/components/Table/Table';

function TxsTable() {
  const accountUser = useGetAddressTemp();
  const dataGetTsxByAddress = useGetTsxByAddress(accountUser);

  const { data, error, status, isFetching, fetchNextPage, hasNextPage } =
    dataGetTsxByAddress;

  let validatorRows = [[]];

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

  const tableData = React.useMemo(() => [...validatorRows[0]], [validatorRows]);

  return (
    <ContainerGradientText>
      <Table columns={columns} data={tableData} isLoading={isFetching}>
        <InfiniteScroll
          dataLength={Object.keys(validatorRows).length}
          next={fetchNextPageFnc}
          style={{ display: 'grid', gap: '15px' }}
          hasMore={hasNextPage}
          loader={isFetching && <Loader2 />}
        >
          {status === 'loading' ? (
            <Dots />
          ) : status === 'error' ? (
            <span>Error: {error.message}</span>
          ) : validatorRows.length > 0 ? (
            validatorRows
          ) : (
            <NoItems text="No txs" />
          )}
        </InfiniteScroll>
      </Table>
    </ContainerGradientText>
  );
}

export default TxsTable;
