import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Pane } from '@cybercongress/gravity';
import axios from 'axios';
import { CardStatisics, Dots, Loading } from '../../components';
import { AppContext } from '../../context';
import { CYBER } from '../../utils/config';
import AccountCount from '../brain/accountCount';
import { formatCurrency } from '../../utils/utils';
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

const search = async (client, hash) => {
  try {
    const responseSearchResults = await client.search(hash);
    console.log(`responseSearchResults`, responseSearchResults);
    return responseSearchResults.result ? responseSearchResults.result : [];
  } catch (error) {
    return [];
  }
};

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

const Home = ({ node, mobile, defaultAccount }) => {
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
          const { cids, links } = responseGraphStats;
          const bits = 40 * parseFloat(links) + 40 * parseFloat(cids);
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
        setResultSearch([]);
        setLoadingSearch(true);
        const hash = await getIpfsHash('superintelligence');
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
                query: 'superintelligence',
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
  }, [jsCyber, update]);

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
          />
          <CardStatisics
            value={
              memoryLoader ? <Dots /> : formatCurrency(memory, 'B', 2, PREFIXES)
            }
            title="GPU memory"
          />
          <CardStatisics value={<AccountCount />} title="Neurons" />
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
              selectedTokens="superintelligence"
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
};

const mapStateToProps = (store) => {
  return {
    mobile: store.settings.mobile,
    node: store.ipfs.ipfs,
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(Home);
