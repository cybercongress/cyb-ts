import { UseInfiniteQueryResult } from '@tanstack/react-query';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getNowUtcTime, timeSince } from 'src/utils/utils';
import { ContainerGradientText, Dots } from 'src/components';
import { AccountValue } from 'src/types/defaultAccount';
import { Nullable } from 'src/types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AmountDenom } from 'src/containers/txs/Activites';
import { Link } from 'react-router-dom';

function DataSendTxs({
  dataSendTxs,
  accountUser,
}: {
  dataSendTxs: UseInfiniteQueryResult;
  accountUser: Nullable<AccountValue>;
}) {
  const { data, error, status, isFetching, fetchNextPage, hasNextPage } =
    dataSendTxs;

  let itemRows: React.ReactNode[] = [];

  if (data) {
    itemRows = data.pages.map((page) => (
      <React.Fragment key={page.page}>
        {page.data.map((item) => {
          const key = uuidv4();
          let timeAgoInMS = null;
          const { memo } = item.transaction;
          const time =
            getNowUtcTime() - Date.parse(item.transaction.block.timestamp);
          if (time > 0) {
            timeAgoInMS = time;
          }

          let typeTx = item.type;
          if (
            typeTx.includes('MsgSend') &&
            item?.value?.to_address === accountUser?.bech32
          ) {
            typeTx = 'Receive';
          }

          return (
            <Link
              to={`/network/bostrom/tx/${item.transaction_hash}`}
              key={`${item.transaction_hash}_${key}`}
            >
              <ContainerGradientText
                status={item.transaction.success ? 'blue' : 'red'}
                userStyleContent={{ display: 'grid', gap: '10px' }}
              >
                <div
                  style={{
                    color: '#fff',
                  }}
                >
                  {memo}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      color: typeTx === 'Receive' ? '#76FF03' : '#FF5C00',
                    }}
                  >
                    {item.value.amount.map((item, i) => {
                      return (
                        <AmountDenom
                          denom={item.denom}
                          amountValue={item.amount}
                          key={i}
                        />
                      );
                    })}
                  </div>
                  <div
                    style={{
                      color: '#777',
                    }}
                  >
                    {timeSince(timeAgoInMS)} ago
                  </div>
                </div>
              </ContainerGradientText>
            </Link>
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
    <InfiniteScroll
      dataLength={Object.keys(itemRows).length}
      next={fetchNextPageFnc}
      style={{ display: 'grid', gap: '15px', marginTop: '20px' }}
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
      ) : itemRows.length > 0 ? (
        itemRows
      ) : null}
    </InfiniteScroll>
  );
}

export default DataSendTxs;
