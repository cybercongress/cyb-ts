import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRobotContext } from 'src/pages/robot/robot.context';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RootState } from 'src/redux/store';
import {
  NoItems,
  Dots,
  SearchSnippet,
  ContainerGradientText,
} from '../../components';
import useGetTweets from './useGetTweets';
import ActionBarCont from '../market/actionBarContainer';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';

const keywordHash = 'QmbdH2WBamyKLPE5zu4mJ9v49qvY8BFfoumoVPMR5V4Rvx';

const LOAD_COUNT = 10;

function Taverna() {
  const { address, isOwner } = useRobotContext();
  const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  const { tweets, loadingTweets } = useGetTweets(address || null);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [rankLink, setRankLink] = useState<string | null>();
  const [update, setUpdate] = useState(1);

  const [itemsToShow, setItemsToShow] = useState(20);

  useEffect(() => {
    setRankLink(null);
  }, [update]);

  async function onClickRank(key: string) {
    if (rankLink === key) {
      setRankLink(null);
    } else {
      setRankLink(key);
    }
  }

  // const d = new Date();

  const displayedPalettes = useMemo(
    () =>
      Object.keys(tweets)
        .sort((a, b) => {
          const x = Date.parse(tweets[a].time);
          const y = Date.parse(tweets[b].time);
          return y - x;
        })
        .slice(0, itemsToShow)
        .map((key) => {
          // let timeAgoInMS = 0;
          // const time = Date.parse(d) - Date.parse(tweets[key].time);
          // if (time > 0) {
          //   timeAgoInMS = time;
          // }
          return (
            <SearchSnippet
              key={key}
              cid={key}
              data={tweets[key]}
              onClickRank={onClickRank}
            />
            // <Pane
            //   position="relative"
            //   className="hover-rank"
            //   display="flex"
            //   alignItems="center"
            //   marginBottom="10px"
            //   key={`${key}_${i}`}
            // >
            //   {!mobile && (
            //     <Pane
            //       className="time-discussion rank-contentItem"
            //       position="absolute"
            //     >
            //       <Rank
            //         hash={key}
            //         rank="n/a"
            //         grade={{ from: 'n/a', to: 'n/a', value: 'n/a' }}
            //         onClick={() => onClickRank(key)}
            //       />
            //     </Pane>
            //   )}
            //   <ContentItem
            //     nodeIpfs={node}
            //     cid={key}
            //     item={tweets[key]}
            //     className="contentItem"
            //   />
            //   <Pane
            //     className="time-discussion rank-contentItem"
            //     position="absolute"
            //     right="0"
            //     fontSize={12}
            //     whiteSpace="nowrap"
            //     top="5px"
            //   >
            //     {timeSince(timeAgoInMS)} ago
            //   </Pane>
            // </Pane>
          );
        }),
    [itemsToShow, tweets]
  );

  if (loadingTweets) {
    return <Dots />;
  }

  function loadMore() {
    setItemsToShow((i) => i + LOAD_COUNT);
  }

  return (
    <>
      <ContainerGradientText>
        {/* <main className="block-body"> */}
        {/* <Pane
            width="90%"
            marginX="auto"
            marginY={0}
            display="flex"
            flexDirection="column"
          > */}

        <div className="container-contentItem" style={{ width: '100%' }}>
          <InfiniteScroll
            dataLength={itemsToShow}
            next={loadMore}
            // endMessage={<p>all loaded</p>}
            hasMore={Object.keys(tweets).length > itemsToShow}
            loader={<Dots />}
          >
            {Object.keys(tweets).length > 0 ? (
              displayedPalettes
            ) : (
              <NoItems text="No feeds" />
            )}
          </InfiniteScroll>
        </div>

        {/* </Pane> */}
        {/* </main> */}
      </ContainerGradientText>

      <div
        style={{
          position: 'fixed',
          left: 0,
          zIndex: 1,
        }}
      >
        {isOwner && (
          <ActionBarCont
            addressActive={addressActive}
            keywordHash={keywordHash}
            updateFunc={() => setUpdate(update + 1)}
            rankLink={rankLink}
            textBtn="Tweet"
          />
        )}
      </div>
    </>
  );
}

export default Taverna;
