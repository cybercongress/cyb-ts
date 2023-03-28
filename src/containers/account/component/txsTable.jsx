/* eslint-disable no-nested-ternary */
import React from 'react';
import { TableEv as Table } from '@cybercongress/gravity';
import InfiniteScroll from 'react-infinite-scroll-component';
import { v4 as uuidv4 } from 'uuid';

import { Link } from 'react-router-dom';
import { Dots, MsgType, NoItems, TextTable } from '../../../components';
import { timeSince, trimString } from '../../../utils/utils';
import statusTrueImg from '../../../image/ionicons_svg_ios-checkmark-circle.svg';
import statusFalseImg from '../../../image/ionicons_svg_ios-close-circle.svg';
import RenderValue from './RenderValue';
import { ContainerGradientText } from '../../portal/components/containerGradient/ContainerGradient';

function TxsTable({ dataGetTsxByAddress, accountUser }) {
  const { data, error, status, isFetching, fetchNextPage, hasNextPage } =
    dataGetTsxByAddress;

  let validatorRows = [];

  if (data) {
    validatorRows = data.pages.map((page) => (
      <React.Fragment key={page.page}>
        {page.data.map((item, index) => {
          const key = uuidv4();
          let timeAgoInMS = null;
          const d = new Date().toUTCString();
          const time =
            Date.parse(d) - Date.parse(item.transaction.block.timestamp);
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

          return (
            <ContainerGradientText
              status={item.transaction.success ? 'blue' : 'red'}
            >
              <Table.Row
                // borderBottom="none"
                paddingX={0}
                paddingY={10}
                borderBottom="none"
                display="flex"
                minHeight="48px"
                height="fit-content"
                key={`${item.transaction_hash}_${key}`}
              >
                <Table.TextCell flex={0.5} textAlign="center">
                  <TextTable>
                    <img
                      style={{
                        width: '20px',
                        height: '20px',
                        marginRight: '5px',
                      }}
                      src={
                        item.transaction.success
                          ? statusTrueImg
                          : statusFalseImg
                      }
                      alt="statusImg"
                    />
                  </TextTable>
                </Table.TextCell>
                <Table.TextCell flex={1.2} textAlign="center">
                  <TextTable>
                    <MsgType type={typeTx} />
                  </TextTable>
                </Table.TextCell>
                <Table.TextCell textAlign="center">
                  <TextTable>{timeSince(timeAgoInMS)} ago</TextTable>
                </Table.TextCell>
                <Table.TextCell textAlign="center">
                  <TextTable>
                    <Link to={`/network/bostrom/tx/${item.transaction_hash}`}>
                      {trimString(item.transaction_hash, 6, 6)}
                    </Link>
                  </TextTable>
                </Table.TextCell>
                <Table.TextCell flex={2} textAlign="end">
                  <TextTable display="flex">
                    <RenderValue
                      value={item.value}
                      type={item.type}
                      accountUser={accountUser}
                    />
                  </TextTable>
                </Table.TextCell>
              </Table.Row>
            </ContainerGradientText>
          );
        })}
      </React.Fragment>
    ));
  }

  const fetchNextPageFnc = () => {
    setTimeout(() => {
      fetchNextPage();
    }, 250);
  };

  return (
    <Table>
      <Table.Head
        style={{
          backgroundColor: '#000',
          border: 'none',
          marginTop: '10px',
          padding: 7,
          paddingBottom: '10px',
        }}
      >
        <Table.TextHeaderCell flex={0.5} textAlign="center">
          <TextTable>status</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={1.2} textAlign="center">
          <TextTable>type</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell textAlign="center">
          <TextTable>timestamp</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell textAlign="center">
          <TextTable>tx</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={2} textAlign="center">
          <TextTable>action</TextTable>
        </Table.TextHeaderCell>
      </Table.Head>
      <Table.Body
        style={{
          backgroundColor: '#000',
          overflowY: 'hidden',
          padding: 7,
        }}
      >
        <InfiniteScroll
          dataLength={Object.keys(validatorRows).length}
          next={fetchNextPageFnc}
          style={{ display: 'grid', gap: '15px' }}
          hasMore={hasNextPage}
          loader={
            isFetching && (
              <h4>
                Loading
                <Dots />
              </h4>
            )
          }
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
      </Table.Body>
    </Table>
  );
}

export default TxsTable;
