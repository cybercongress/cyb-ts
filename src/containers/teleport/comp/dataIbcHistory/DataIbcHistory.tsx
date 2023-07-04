import { useCallback, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Dots } from 'src/components';
import DataIbcHistoryItem from './dataItem';
import { useIbcHistory } from '../../ibc-history/historyContext';

function DataIbcHistory() {
  const { ibcHistory } = useIbcHistory();
  const [itemsToShow, setItemsToShow] = useState(5);

  const setNextDisplayed = useCallback(() => {
    setTimeout(() => {
      setItemsToShow(itemsToShow + 5);
    }, 250);
  }, [itemsToShow, setItemsToShow]);

  const displayedPalettes = useMemo(() => {
    if (ibcHistory) {
      return ibcHistory.slice(0, itemsToShow);
    }
    return [];
  }, [itemsToShow, ibcHistory]);

  const ItemRows = useMemo(() => {
    return displayedPalettes.map((item) => {
      return <DataIbcHistoryItem key={item.txHash} item={item} />;
    });
  }, [displayedPalettes]);

  return (
    <InfiniteScroll
      dataLength={ItemRows.length}
      next={setNextDisplayed}
      hasMore={Boolean(ibcHistory && itemsToShow < ibcHistory.length)}
      style={{ display: 'grid', gap: '15px', marginTop: '20px' }}
      loader={
        <h4>
          Loading
          <Dots />
        </h4>
      }
    >
      {ItemRows.length > 0 ? ItemRows : ''}
    </InfiniteScroll>
  );
}

export default DataIbcHistory;
