/* eslint-disable no-await-in-loop */
import React, { useEffect, useState, useContext } from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import { connect } from 'react-redux';
import { Route, Link, useLocation } from 'react-router-dom';
import { getIpfsHash, getRankGrade } from '../../utils/search/utils';
import { Loading } from '../../components';
import useGetCybernomics from './useGetTokensInfo';
import { AppContext } from '../../context';
import SearchTokenInfo from './searchTokensInfo';
import InfoTokens from './infoTokens';
import ActionBarCont from './actionBarContainer';
import useSetActiveAddress from './useSetActiveAddress';

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
  if (pathname === '/market') {
    return 'BOOT';
  }

  if (pathname === '/market/CYB') {
    return 'CYB';
  }

  if (pathname === '/market/A') {
    return 'A';
  }

  if (pathname === '/market/V') {
    return 'V';
  }

  if (pathname === '/market/GOL') {
    return 'GOL';
  }

  if (pathname === '/market/H') {
    return 'H';
  }

  return 'BOOT';
};

function Market({ node, mobile, defaultAccount }) {
  const location = useLocation();
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const { jsCyber } = useContext(AppContext);
  const { gol, cyb, boot, hydrogen, milliampere, millivolt } = useGetCybernomics();
  const [selectedTokens, setSelectedTokens] = useState('BOOT');
  const [resultSearch, setResultSearch] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(true);
  const [keywordHash, setKeywordHash] = useState('');
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    const { pathname } = location;
    const requere = chekPathname(pathname);
    setSelectedTokens(requere);
  }, [location.pathname]);

  useEffect(() => {
    const feachData = async () => {
      if (jsCyber !== null) {
        setResultSearch([]);
        setLoadingSearch(true);
        const hash = await getIpfsHash(selectedTokens);
        setKeywordHash(hash);
        const responseApps = await search(jsCyber, hash);
        if (responseApps.length > 0) {
          const dataApps = responseApps.reduce(
            (obj, item) => ({
              ...obj,
              [item.cid]: {
                cid: item.cid,
                rank: item.rank,
                grade: getRankGrade(item.rank),
                status: node !== null ? 'understandingState' : 'impossibleLoad',
                query: selectedTokens,
                text: item.cid,
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
  }, [jsCyber, selectedTokens, update]);

  let content;

  if (selectedTokens === 'BOOT') {
    content = (
      <Route
        path="/market"
        render={() => (
          <InfoTokens selectedTokens={selectedTokens} data={boot} />
        )}
      />
    );
  }

  if (selectedTokens === 'H') {
    content = (
      <Route
        path="/market/H"
        render={() => (
          <InfoTokens selectedTokens={selectedTokens} data={hydrogen} />
        )}
      />
    );
  }

  if (selectedTokens === 'A') {
    content = (
      <Route
        path="/market/A"
        render={() => (
          <InfoTokens selectedTokens={selectedTokens} data={milliampere} />
        )}
      />
    );
  }

  if (selectedTokens === 'V') {
    content = (
      <Route
        path="/market/V"
        render={() => (
          <InfoTokens selectedTokens={selectedTokens} data={millivolt} />
        )}
      />
    );
  }

  if (selectedTokens === 'GOL') {
    content = (
      <Route
        path="/market/GOL"
        render={() => (
          <InfoTokens
            selectedTokens={selectedTokens}
            data={gol}
            titlePrice="Uniswap price of GGOL in ETH"
            linkSupply="https://etherscan.io/token/0xF4ecdBa8ba4144Ff3a2d8792Cad9051431Aa4F64"
            linkPrice="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xF4ecdBa8ba4144Ff3a2d8792Cad9051431Aa4F64"
          />
        )}
      />
    );
  }

  if (selectedTokens === 'CYB') {
    content = (
      <Route
        path="/market/CYB"
        render={() => (
          <InfoTokens
            selectedTokens={selectedTokens}
            data={cyb}
            titlePrice="Port price of GCYB in ETH"
          />
        )}
      />
    );
  }

  return (
    <>
      <main className="block-body">
        {addressActive === null && (
          <Pane
            boxShadow="0px 0px 5px #36d6ae"
            paddingX={20}
            paddingY={20}
            marginY={20}
          >
            <Text fontSize="16px" color="#fff">
              Subscribe to someone to make your feed work. Until then, we'll
              show you the project feed. Start by adding a ledger to{' '}
              <Link to="/">your pocket</Link>.
            </Text>
          </Pane>
        )}
        <ContainerGrid>{content}</ContainerGrid>
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
              selectedTokens={selectedTokens}
            />
          )}
        </ContainerGrid>
      </main>
      <ActionBarCont
        addressActive={addressActive}
        mobile={mobile}
        keywordHash={keywordHash}
        updateFunc={() => setUpdate(update + 1)}
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

export default connect(mapStateToProps)(Market);
