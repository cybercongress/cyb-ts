import { useCallback, useMemo, useState } from 'react';
import DataIbcHistoryItem from './dataItem';
import { useIbcHistory } from '../../ibc-history/historyContext';
import InfiniteScrollDataTsx from '../InfiniteScrollDataTxs/InfiniteScrollDataTsx';

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

  const hasMore = useMemo(() => {
    return Boolean(ibcHistory && itemsToShow < ibcHistory.length);
  }, [ibcHistory, itemsToShow]);

  return (
    <InfiniteScrollDataTsx
      dataLength={ItemRows.length}
      next={setNextDisplayed}
      hasMore={hasMore}
    >
      {ItemRows.length > 0 && ItemRows}
    </InfiniteScrollDataTsx>
  );
}

export default DataIbcHistory;
