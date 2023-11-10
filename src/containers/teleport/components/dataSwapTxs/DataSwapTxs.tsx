import { UseInfiniteQueryResult } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Dots } from 'src/components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import { ResponseTxsByType } from '../../hooks/useGetSendTxsByAddress';
import DataSwapTxsItem from './DataSwapTxsItem';

type DataTxs = {
  data: ResponseTxsByType[];
  page: any;
};

function DataSwapTxs({
  dataTxs,
}: {
  dataTxs: UseInfiniteQueryResult<DataTxs>;
}) {
  const { traseDenom } = useIbcDenom();
  const { data, error, status, isFetching, fetchNextPage, hasNextPage } =
    dataTxs;

  const itemRows = useMemo(() => {
    if (data && traseDenom) {
      return data.pages.map((page) => (
        <React.Fragment key={page.page}>
          {page.data.map((item) => {
            const key = uuidv4();

            return (
              <DataSwapTxsItem
                item={item}
                key={`${item.transaction_hash}_${key}`}
              />
            );
          })}
        </React.Fragment>
      ));
    }

    return [];
  }, [data, traseDenom]);

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

export default DataSwapTxs;
