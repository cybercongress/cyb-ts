import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './InfiniteScrollDataTsx.module.scss';
import Loader2 from 'src/components/ui/Loader2';

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
      loader={<Loader2 text="loading swap history" />}
    >
      {children}
    </InfiniteScroll>
  );
}

export default InfiniteScrollDataTsx;
