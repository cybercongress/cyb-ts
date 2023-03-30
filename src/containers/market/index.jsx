/* eslint-disable no-await-in-loop */
import { useEffect, useState, useContext } from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getIpfsHash, getRankGrade } from '../../utils/search/utils';
import { Loading } from '../../components';
import useGetCybernomics from './useGetTokensInfo';
import { AppContext } from '../../context';
import SearchTokenInfo from './searchTokensInfo';
import InfoTokens from './infoTokens';
import ActionBarCont from './actionBarContainer';
import useSetActiveAddress from './useSetActiveAddress';
import { coinDecimals } from '../../utils/utils';

function ContainerGrid({ children }) {
  return (
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
}

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

function Market({ node, mobile, defaultAccount }) {
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const { jsCyber } = useContext(AppContext);
  const { tab = 'BOOT' } = useParams();
  const { gol, cyb, boot, hydrogen, milliampere, millivolt, tocyb } =
    useGetCybernomics();
  const [resultSearch, setResultSearch] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(true);
  const [keywordHash, setKeywordHash] = useState('');
  const [update, setUpdate] = useState(0);
  const [rankLink, setRankLink] = useState(null);
  const [page, setPage] = useState(0);
  const [allPage, setAllPage] = useState(0);

  useEffect(() => {
    const getFirstItem = async () => {
      if (jsCyber !== null) {
        setPage(0);
        setAllPage(0);
        setResultSearch([]);
        setLoadingSearch(true);
        const hash = await getIpfsHash(tab);
        setKeywordHash(hash);
        const responseApps = await search(jsCyber, hash, 0);
        if (responseApps.result && responseApps.result.length > 0) {
          const dataApps = reduceSearchResults(responseApps.result, tab);
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
    getFirstItem();
  }, [jsCyber, tab, update]);

  const fetchMoreData = async () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    let links = [];
    const data = await search(jsCyber, keywordHash, page);
    if (data.result) {
      links = reduceSearchResults(data.result, tab);
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
        {addressActive === null && (
          <Pane
            boxShadow="0px 0px 5px #36d6ae"
            paddingX={20}
            paddingY={20}
            marginY={20}
          >
            <Text fontSize="16px" color="#fff">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Subscribe to someone to make your feed work. Until then, we'll
              show you the project feed. Start by adding a ledger to{' '}
              <Link to="/">your pocket</Link>.
            </Text>
          </Pane>
        )}
        <ContainerGrid>
          {tab === 'BOOT' && <InfoTokens selectedTokens={tab} data={boot} />}

          {tab === 'H' && <InfoTokens selectedTokens={tab} data={hydrogen} />}

          {tab === 'A' && (
            <InfoTokens selectedTokens={tab} data={milliampere} />
          )}

          {tab === 'V' && <InfoTokens selectedTokens={tab} data={millivolt} />}

          {tab === 'TOCYB' && <InfoTokens selectedTokens={tab} data={tocyb} />}

          {tab === 'GOL' && (
            <InfoTokens
              selectedTokens={tab}
              data={gol}
              titlePrice="Uniswap price of GGOL in ETH"
              linkSupply="https://etherscan.io/token/0xF4ecdBa8ba4144Ff3a2d8792Cad9051431Aa4F64"
              linkPrice="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xF4ecdBa8ba4144Ff3a2d8792Cad9051431Aa4F64"
            />
          )}

          {tab === 'CYB' && (
            <InfoTokens
              selectedTokens={tab}
              data={cyb}
              titlePrice="Port price of GCYB in ETH"
            />
          )}
        </ContainerGrid>
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
              selectedTokens={tab}
              onClickRank={onClickRank}
              fetchMoreData={fetchMoreData}
              page={page}
              allPage={allPage}
            />
          )}
        </ContainerGrid>
      </main>
      {!mobile && (
        <ActionBarCont
          addressActive={addressActive}
          mobile={mobile}
          keywordHash={keywordHash}
          updateFunc={() => setUpdate(update + 1)}
          rankLink={rankLink}
        />
      )}
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
