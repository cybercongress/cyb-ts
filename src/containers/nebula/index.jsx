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

const search = async (client, hash) => {
  try {
    const responseSearchResults = await client.search(hash);
    console.log(`responseSearchResults`, responseSearchResults);
    return responseSearchResults.result ? responseSearchResults.result : [];
  } catch (error) {
    return [];
  }
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

  useEffect(() => {
    const { pathname } = location;
    const requere = chekPathname(pathname);
    setQuerySearch(requere);
  }, [location.pathname]);

  useEffect(() => {
    const feachData = async () => {
      if (jsCyber !== null) {
        setResultSearch([]);
        setLoadingSearch(true);
        const hash = await getIpfsHash(querySearch);
        setKeywordHash(hash);
        const responseApps = await search(jsCyber, hash);
        if (responseApps.length > 0) {
          const dataApps = responseApps.reduce(
            (obj, item) => ({
              ...obj,
              [item.particle]: {
                particle: item.particle,
                rank: coinDecimals(item.rank),
                grade: getRankGrade(coinDecimals(item.rank)),
                status: 'impossibleLoad',
                query: querySearch,
                text: item.particle,
                content: false,
              },
            }),
            {}
          );
          setResultSearch(dataApps);
          setLoadingSearch(false);
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
