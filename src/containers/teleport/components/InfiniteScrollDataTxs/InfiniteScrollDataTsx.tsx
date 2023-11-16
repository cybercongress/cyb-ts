import InfiniteScroll from 'react-infinite-scroll-component';
import { Dots } from 'src/components';
import s from './InfiniteScrollDataTsx.module.scss';

type Props = {
  dataLength: number;
  next: () => void;
  hasMore: boolean;
  children: React.ReactNode;
};

function InfiniteScrollDataTsx({ dataLength, next, hasMore, children }: Props) {
  return (
    <InfiniteScroll
      className={s.content}
      dataLength={dataLength}
      next={next}
      hasMore={hasMore}
      style={{ display: 'grid', gap: '15px', marginTop: '20px' }}
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
