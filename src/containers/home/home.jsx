import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Pane } from '@cybercongress/gravity';
import axios from 'axios';
import { CardStatisics, Dots, Loading } from '../../components';
import { AppContext } from '../../context';
import { CYBER } from '../../utils/config';
import AccountCount from '../brain/accountCount';
import Txs from '../brain/tx';
import { formatCurrency, coinDecimals, formatNumber } from '../../utils/utils';
import { setQuery } from '../../redux/actions/query';
import { getIpfsHash, getRankGrade } from '../../utils/search/utils';
import ActionBarCont from '../market/actionBarContainer';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import SearchTokenInfo from '../market/searchTokensInfo';

const PREFIXES = [
  {
    prefix: 'T',
    power: 1024 * 10 ** 9,
  },
  {
    prefix: 'G',
    power: 1024 * 10 ** 6,
  },
  {
    prefix: 'M',
    power: 1024 * 10 ** 3,
  },
  {
    prefix: 'K',
    power: 1024,
  },
];

const search = async (client, hash, page) => {
  try {
    const responseSearchResults = await client.search(hash, page);
    console.log(`responseSearchResults`, responseSearchResults);
    return responseSearchResults.result ? responseSearchResults : [];
  } catch (error) {
    return [];
  }
};

const ContainerGrid = ({ children }) => (
  <Pane
    marginTop={10}
    marginBottom={50}
    display="grid"
    gridTemplateColumns="repeat(auto-fit, minmax(210px, 1fr))"
    gridGap="20px"
  >
    {children}
  </Pane>
);

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

const Home = ({ node, mobile, defaultAccount, block }) => {
  const { jsCyber } = useContext(AppContext);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [entropy, setEntropy] = useState(0);
  const [entropyLoader, setEntropyLoader] = useState(true);
  const [memory, setMemory] = useState(0);
  const [memoryLoader, setMemoryLoader] = useState(true);
  const [resultSearch, setResultSearch] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(true);
  const [keywordHash, setKeywordHash] = useState('');
  const [rankLink, setRankLink] = useState(null);
  const [update, setUpdate] = useState(0);
  const [page, setPage] = useState(0);
  const [allPage, setAllPage] = useState(0);

  useEffect(() => {
    getEntropy();
  }, []);

  const getEntropy = async () => {
    try {
      setEntropyLoader(true);
      const response = await axios({
        method: 'get',
        url: `${CYBER.CYBER_NODE_URL_LCD}/rank/negentropy`,
      });
      if (response.data.result.negentropy) {
        setEntropy(response.data.result.negentropy);
      }
      setEntropyLoader(false);
    } catch (e) {
      console.log(e);
      setEntropy(0);
      setEntropyLoader(false);
    }
  };

  useEffect(() => {
    try {
      const getGraphStats = async () => {
        setMemoryLoader(true);
        if (jsCyber !== null) {
          const responseGraphStats = await jsCyber.graphStats();
          const { particles, cyberlinks } = responseGraphStats;
          const bits = 40 * parseFloat(cyberlinks) + 40 * parseFloat(particles);
          setMemory(bits);
        }
        setMemoryLoader(false);
      };
      getGraphStats();
    } catch (e) {
      console.log(e);
      setMemory(0);
      setMemoryLoader(false);
    }
  }, [jsCyber]);

  useEffect(() => {
    const feachData = async () => {
      if (jsCyber !== null) {
        setPage(0);
        setAllPage(0);
        setResultSearch([]);
        setLoadingSearch(true);
        const hash = await getIpfsHash('bootloader');
        setKeywordHash(hash);
        const responseApps = await search(jsCyber, hash);
        if (Object.keys(responseApps).length > 0) {
          const dataApps = reduceSearchResults(
            responseApps.result,
            'bootloader'
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
  }, [jsCyber, update]);

  const fetchMoreData = async () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    let links = [];
    const data = await search(jsCyber, keywordHash, page);
    if (data.result) {
      links = reduceSearchResults(data.result, 'bootloader');
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
          <CardStatisics
            value={entropyLoader ? <Dots /> : `${entropy} bits`}
            title="Negentropy"
            styleContainer={{ minWidth: 'unset' }}
          />
          <CardStatisics
            value={
              memoryLoader ? <Dots /> : formatCurrency(memory, 'B', 0, PREFIXES)
            }
            title="GPU memory"
            styleContainer={{ minWidth: 'unset' }}
          />
          <Link to="/network/bostrom/tx">
            <CardStatisics
              title="Transactions"
              value={<Txs />}
              styleContainer={{ minWidth: 'unset' }}
            />
          </Link>
          <Link to="/network/bostrom/block">
            <CardStatisics
              title="Blocks"
              value={formatNumber(parseFloat(block))}
              styleContainer={{ minWidth: 'unset' }}
            />
          </Link>
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
              selectedTokens="bootloader"
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
};

const mapStateToProps = (store) => {
  return {
    mobile: store.settings.mobile,
    node: store.ipfs.ipfs,
    defaultAccount: store.pocket.defaultAccount,
    block: store.block.block,
  };
};

export default connect(mapStateToProps)(Home);
