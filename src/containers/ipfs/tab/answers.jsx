import { Pane } from '@cybercongress/gravity';
import InfiniteScroll from 'react-infinite-scroll-component';
import ContentItem from '../../../components/ContentItem/contentItem';
import { Rank, NoItems, Dots } from '../../../components';
import { getRankGrade } from '../../../utils/search/utils';
import { exponentialToDecimal, coinDecimals } from '../../../utils/utils';

function AnswersTab({
  data,
  mobile,
  nodeIpfs,
  fetchMoreData,
  page,
  allPage,
  total,
}) {
  const answers = [];
  if (Object.keys(data).length > 0) {
    answers.push(
      Object.keys(data).map((item, i) => {
        const rank = coinDecimals(data[item].rank);
        const grade = getRankGrade(rank);
        return (
          <Pane
            position="relative"
            className="hover-rank"
            display="flex"
            alignItems="center"
            marginBottom="10px"
            key={`${data[item].particle}_${i}`}
          >
            {!mobile && (
              <Pane
                className="time-discussion rank-contentItem"
                position="absolute"
              >
                <Rank
                  hash={data[item].particle}
                  rank={exponentialToDecimal(parseFloat(rank).toPrecision(3))}
                  grade={grade}
                />
              </Pane>
            )}
            <ContentItem
              nodeIpfs={nodeIpfs}
              cid={data[item].particle}
              item={data[item]}
              className="contentItem"
            />
          </Pane>
        );
      })
    );
  }
  return (
    <div className="container-contentItem" style={{ width: '100%' }}>
      <InfiniteScroll
        dataLength={Object.keys(data).length}
        next={fetchMoreData}
        hasMore={Object.keys(data).length < total}
        loader={
          <h4>
            Loading
            <Dots />
          </h4>
        }
        pullDownToRefresh
        pullDownToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        }
        refreshFunction={fetchMoreData}
      >
        {Object.keys(data).length > 0 ? answers : <NoItems text="no answers" />}
      </InfiniteScroll>
    </div>
  );
}

export default AnswersTab;
