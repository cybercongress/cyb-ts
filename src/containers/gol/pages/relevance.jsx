import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { Pane, SearchItem, Text } from '@cybercongress/gravity';
import Iframe from 'react-iframe';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import {
  getIpfsHash,
  search,
  getRankGrade,
  getDrop,
  getContentByCid,
  getRelevance,
} from '../../../utils/search/utils';
import { formatNumber } from '../../../utils/utils';
import { Loading } from '../../../components';
// import ActionBarContainer from './ActionBarContainer';
// import {
//   CYBER,
//   PATTERN,
//   PATTERN_CYBER,
//   PATTERN_TX,
//   PATTERN_CYBER_VALOPER,
// } from '../../utils/config';
// import Gift from './gift';
// import SnipitAccount from './snipitAccountPages';

const GolRelevance = () => {
  const [linksRelevance, setLinksRelevance] = useState([]);
  const containerReference = useRef();
  const [itemsToShow, setItemsToShow] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      let data = await getRelevance();
      // const links = data.cids.reduce(
      //   (obj, link) => ({
      //     ...obj,
      //     [link.cid]: {
      //       rank: formatNumber(link.rank, 6),
      //       grade: getRankGrade(link.rank),
      //       status: 'loading',
      //     },
      //   }),
      //   {}
      // );
      // data = links;
      setLinksRelevance(data.cids);
    };
    fetchData();
  }, []);

  const setNextDisplayedPalettes = useCallback(() => {
    setItemsToShow(itemsToShow + 10);
  }, [itemsToShow, setItemsToShow]);

  const displayedPalettes = useMemo(() => {
     return linksRelevance.slice(0, itemsToShow);
  }, [itemsToShow]);
  // if (loading) {я
  //   return (
  //     <div
  //       style={{
  //         width: '100%',
  //         height: '50vh',
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         flexDirection: 'column',
  //       }}
  //     >
  //       <Loading />
  //       <div style={{ color: '#fff', marginTop: 20, fontSize: 20 }}>
  //         Searching
  //       </div>
  //     </div>
  //   );
  // }
  const searchItems = [];
  const link = displayedPalettes;
  console.log(link);
  // searchItems.push(
  //   Object.keys(link).map(key => {
  //     let contentItem = false;
  //     if (link[key].status === 'success') {
  //       if (link[key].content !== undefined) {
  //         if (link[key].content.indexOf(key) === -1) {
  //           contentItem = true;
  //         }
  //       }
  //     }
  //     return (
  //       <SearchItem
  //         key={key}
  //         hash={key}
  //         rank={link[key].rank}
  //         grade={link[key].grade}
  //         status={link[key].status}
  //         contentIpfs={link[key].content}
  //         // onClick={e => (e, links[cid].content)}
  //       >
  //         {/* {contentItem && (
  //           <Iframe
  //             width="100%"
  //             height="fit-content"
  //             className="iframe-SearchItem"
  //             url={displayedPalettes[key].content}
  //           />
  //         )} */}
  //       </SearchItem>
  //     );
  //   })
  // );

  return (
    <main className="block-body" style={{ paddingTop: 30 }}>
      <Pane
        width="90%"
        marginX="auto"
        marginY={0}
        display="flex"
        flexDirection="column"
      >
        <Pane>
          <InfiniteScroll
            hasMore={itemsToShow < linksRelevance.length}
            loader={<Loading />}
            pageStart={0}
            useWindow={false}
            loadMore={setNextDisplayedPalettes}
            getScrollParent={() => containerReference.current}
          >
            {searchItems}
          </InfiniteScroll>
        </Pane>
      </Pane>
    </main>
  );
};

const mapStateToProps = store => {
  return {
    node: store.ipfs.ipfs,
  };
};

export default connect(mapStateToProps)(GolRelevance);
