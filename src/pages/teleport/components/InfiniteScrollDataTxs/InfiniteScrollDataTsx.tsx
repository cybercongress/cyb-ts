import InfiniteScroll from 'react-infinite-scroll-component';
import { Dots } from 'src/components';
import styles from './InfiniteScrollDataTsx.module.scss';

type Props = {
  dataLength: number;
  next: () => void;
  hasMore: boolean;
  children: React.ReactNode;
};

function InfiniteScrollDataTsx({ dataLength, next, hasMore, children }: Props) {
  return (
    <InfiniteScroll
      className={styles.content}
      dataLength={dataLength}
      next={next}
      hasMore={hasMore}
      loader={
        <h4>
          Loading
          <Dots />
        </h4>
      }
    >
      {children}
    </InfiniteScroll>
  );
}

export default InfiniteScrollDataTsx;
