/* eslint-disable no-await-in-loop */
import React, { useEffect, useState, useContext } from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import { connect } from 'react-redux';
import { Route, Link, useLocation } from 'react-router-dom';
import { getIpfsHash, getRankGrade } from '../../utils/search/utils';
import { Loading } from '../../components';
import { AppContext } from '../../context';
import SearchTokenInfo from '../market/searchTokensInfo';
import ActionBarCont from '../market/actionBarContainer';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import { coinDecimals } from '../../utils/utils';

const ContainerGrid = ({ children }) => (
  <Pane
    marginTop={10}
    marginBottom={50}
    display="grid"
    gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
    gridGap="20px"
  >
    {children}
  </Pane>
);

const search = async (client, hash, page) => {
  try {
    const responseSearchResults = await client.search(hash, page);
    console.log(`responseSearchResults`, responseSearchResults);
    return responseSearchResults.result ? responseSearchResults : [];
  } catch (error) {
    return [];
  }
};

const reduceSearchResults = (data, query) => {
  return data.reduce(
    (obj, item) => ({
      ...obj,
      [item.particle]: {
        particle: item.particle,
        rank: coinDecimals(item.rank),
        grade: getRankGrade(coinDecimals(item.rank)),
        status: 'impossibleLoad',
        query,
        text: item.particle,
        content: false,
      },
    }),
    {}
  );
};

const chekPathname = (pathname) => {
  if (pathname === '/nebula') {
    return 'app';
  }

  if (pathname === '/nebula/Create app') {
    return 'create app';
  }

  return 'app';
};

function Nebula({ node, mobile, defaultAccount }) {
  const location = useLocation();
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const { jsCyber } = useContext(AppContext);
  const [querySearch, setQuerySearch] = useState('app');
  const [resultSearch, setResultSearch] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(true);
  const [keywordHash, setKeywordHash] = useState('');
  const [update, setUpdate] = useState(0);
  const [rankLink, setRankLink] = useState(null);
  const [page, setPage] = useState(0);
  const [allPage, setAllPage] = useState(0);

  useEffect(() => {
    const { pathname } = location;
    const requere = chekPathname(pathname);
    setQuerySearch(requere);
  }, [location.pathname]);

  useEffect(() => {
    const feachData = async () => {
      if (jsCyber !== null) {
        setPage(0);
        setAllPage(0);
        setResultSearch([]);
        setLoadingSearch(true);
        const hash = await getIpfsHash(querySearch);
        setKeywordHash(hash);
        const responseApps = await search(jsCyber, hash);
        if (responseApps.result && responseApps.result.length > 0) {
          const dataApps = reduceSearchResults(
            responseApps.result,
            querySearch
          );
          setResultSearch(dataApps);
          setLoadingSearch(false);
          setAllPage(Math.ceil(parseFloat(responseApps.pagination.total) / 10));
          setPage((item) => item + 1);
        } else {
          setResultSearch([]);
          setLoadingSearch(false);
        }
      } else {
        setResultSearch([]);
        setLoadingSearch(false);
      }
    };
    feachData();
  }, [jsCyber, querySearch, update]);

  const fetchMoreData = async () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    let links = [];
    const data = await search(jsCyber, keywordHash, page);
    if (data.result) {
      links = reduceSearchResults(data.result, querySearch);
    }

    setTimeout(() => {
      setResultSearch((itemState) => ({ ...itemState, ...links }));
      setPage((itemPage) => itemPage + 1);
    }, 500);
  };

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

  return (
    <>
      <main className="block-body">
        <ContainerGrid>
          {loadingSearch ? (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <Loading />
              <div style={{ color: '#fff', marginTop: 20, fontSize: 20 }}>
                Searching
              </div>
            </div>
          ) : (
            <SearchTokenInfo
              data={resultSearch}
              node={node}
              mobile={mobile}
              selectedTokens={querySearch}
              onClickRank={onClickRank}
              fetchMoreData={fetchMoreData}
              page={page}
              allPage={allPage}
            />
          )}
        </ContainerGrid>
      </main>
      <ActionBarCont
        addressActive={addressActive}
        mobile={mobile}
        keywordHash={keywordHash}
        updateFunc={() => setUpdate(update + 1)}
        rankLink={rankLink}
      />
    </>
  );
}

const mapStateToProps = (store) => {
  return {
    mobile: store.settings.mobile,
    node: store.ipfs.ipfs,
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(Nebula);
