import { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { Pane } from '@cybercongress/gravity';
import { useIpfs } from 'src/contexts/ipfs';
import { useDevice } from 'src/contexts/device';
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

function Taverna() {
  const { isMobile: mobile } = useDevice();
  const { node } = useIpfs();
  const { defaultAccount } = useSelector((state) => state.pocket);
  const { tweets, loadingTweets } = useGetTweets(defaultAccount, node);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [rankLink, setRankLink] = useState(null);
  const [update, setUpdate] = useState(1);

  useEffect(() => {
    setRankLink(null);
  }, [update]);

  const onClickRank = async (key) => {
    if (rankLink === key) {
      setRankLink(null);
    } else {
      setRankLink(key);
    }
  };

  const searchItems = [];
  // const d = new Date();

  if (loadingTweets) {
    return <Dots />;
  }

  searchItems.push(
    Object.keys(tweets)
      .sort((a, b) => {
        const x = Date.parse(tweets[a].time);
        const y = Date.parse(tweets[b].time);
        return y - x;
      })
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
            mobile={mobile}
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
      })
  );

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
          {Object.keys(tweets).length > 0 ? (
            searchItems
          ) : (
            <NoItems text="No feeds" />
          )}
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
        <ActionBarCont
          addressActive={addressActive}
          mobile={mobile}
          keywordHash={keywordHash}
          updateFunc={() => setUpdate(update + 1)}
          rankLink={rankLink}
          textBtn="Tweet"
        />
      </div>
    </>
  );
}

export default Taverna;
