import { useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spark from 'src/components/search/Spark/Spark';
import { Dots } from 'src/components';
import styles from './RowItems.module.scss';
import { InferenceItem } from '../../type';

const LOAD_COUNT = 10;

function RowItems({ dataItem }: { dataItem: InferenceItem[] }) {
  const [itemsToShow, setItemsToShow] = useState(20);

  const loadMore = () => {
    setTimeout(() => {
      setItemsToShow((i) => i + LOAD_COUNT);
    }, 2000);
  };

  const displayedPalettes = useMemo(
    () =>
      dataItem.slice(0, itemsToShow).map((item) => {
        return (
          <Spark key={item.particle} cid={item.particle} itemData={item} />
        );
      }),
    [itemsToShow, dataItem]
  );

  return (
    <InfiniteScroll
      dataLength={itemsToShow}
      next={loadMore}
      // endMessage={<p>all loaded</p>}
      hasMore={dataItem.length > itemsToShow}
      loader={<Dots />}
      className={styles.infiniteScroll}
    >
      {displayedPalettes}
    </InfiniteScroll>
  );
}

export default RowItems;
