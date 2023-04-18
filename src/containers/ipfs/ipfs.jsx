// TODO: Refactor this component - too heavy
import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pane, Tablist, Pill } from '@cybercongress/gravity';
import { useIpfs } from 'src/contexts/ipfs';
import { useDevice } from 'src/contexts/device';
import { getRankGrade, getToLink, getFromLink } from '../../utils/search/utils';
import { TabBtn, Account } from '../../components';
import { formatNumber, coinDecimals } from '../../utils/utils';
import {
  DiscussionTab,
  CommunityTab,
  AnswersTab,
  ContentTab,
  OptimisationTab,
  MetaTab,
} from './tab';
import ActionBarContainer from '../Search/ActionBarContainer';
import useGetIpfsContent from './useGetIpfsContentHook';
import { AppContext } from '../../context';
import ComponentLoader from '../ipfsSettings/ipfsComponents/ipfsLoader';

const dateFormat = require('dateformat');

const search = async (client, hash, page) => {
  try {
    const responseSearchResults = await client.search(hash, page);
    console.log(`responseSearchResults`, responseSearchResults);
    return responseSearchResults.result || [];
  } catch (error) {
    return [];
  }
};

const reduceParticleArr = (data, query = '') => {
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

//TODO: Move to reusable components
const PaneWithPill = ({ caption, count, active }) => (
  <Pane display="flex" alignItems="center">
    <Pane>{caption}</Pane>
    {count > 0 && (
      <Pill marginLeft={5} active={active}>
        {formatNumber(count)}
      </Pill>
    )}
  </Pane>
);

function ContentIpfsCid({ loading, statusFetching, status }) {
  // const loading = dataGetIpfsContent.loading;

  if (loading) {
    return (
      <div
        style={{
          //TODO: Avoid inline styles
          width: '100%',
          // height: '50vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          marginBottom: '50px',
        }}
      >
        <ComponentLoader style={{ width: '100px', margin: '30px auto' }} />
        <div style={{ fontSize: '20px' }}>{statusFetching}</div>
      </div>
    );
  }

  if (!loading && status === 'impossibleLoad') {
    return (
      <div
        style={{
          width: '100%',
          // height: '50vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          marginBottom: '50px',
        }}
      >
        <div style={{ fontSize: '20px' }}>impossible load content</div>
      </div>
    );
  }
}

function Ipfs() {
  const { jsCyber } = useContext(AppContext);
  const { cid, tab = 'discussion' } = useParams();
  const { node: nodeIpfs } = useIpfs();
  const { contentIpfs, status, loading, statusFetching } = useGetIpfsContent(
    cid,
    nodeIpfs
  );
  const { isMobile: mobile } = useDevice();

  // const [content, setContent] = useState('');
  // const [typeContent, setTypeContent] = useState('');
  // const [text, setText] = useState('');
  // const [loadStatus, setLoadStatus] = useState('');
  const [communityData, setCommunityData] = useState({});
  // const [gateway, setGateway] = useState(null);
  const [dataToLink, setDataToLink] = useState([]);
  const [dataFromLink, setDataFromLink] = useState([]);
  const [dataAnswers, setDataAnswers] = useState([]);
  const [dataBacklinks, setDataBacklinks] = useState([]);
  const [page, setPage] = useState(0);
  const [allPage, setAllPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [creator, setCreator] = useState({
    address: '',
    timestamp: '',
  });

  const queryParamsId = `${cid}.${tab}`;
  // const [metaData, setMetaData] = useState({
  //   type: 'file',
  //   size: 0,
  //   blockSizes: [],
  //   data: '',
  // });

  // useEffect(() => {
  //   setContent(dataGetIpfsContent.content);
  //   setTypeContent(dataGetIpfsContent.typeContent);
  //   setGateway(dataGetIpfsContent.gateway);
  //   setMetaData(dataGetIpfsContent.metaData);
  //   setLoadStatus(dataGetIpfsContent.status);
  //   setText(dataGetIpfsContent.text);
  // }, [dataGetIpfsContent]);

  useEffect(() => {
    if (jsCyber !== null) {
      getLinks();
    }
  }, [jsCyber]);

  useEffect(() => {
    const feachBacklinks = async () => {
      setDataBacklinks([]);
      if (jsCyber !== null) {
        const responseBacklinks = await jsCyber.backlinks(cid);
        // console.log(`responseBacklinks`, responseBacklinks)
        if (
          responseBacklinks.result &&
          Object.keys(responseBacklinks.result).length > 0
        ) {
          const { result } = responseBacklinks;
          const reduceArr = reduceParticleArr(result, cid);
          setDataBacklinks(reduceArr);
        }
      }
    };
    feachBacklinks();
  }, [cid, jsCyber]);

  const getLinks = () => {
    feacDataSearch();
    feachCidTo();
    feachCidFrom();
  };

  const feacDataSearch = async () => {
    setDataAnswers([]);
    setAllPage(0);
    setPage(0);
    setTotal(0);
    const responseSearch = await search(jsCyber, cid, 0);
    if (responseSearch.result && responseSearch.result.length > 0) {
      setDataAnswers(reduceParticleArr(responseSearch.result, cid));
      setAllPage(Math.ceil(parseFloat(responseSearch.pagination.total) / 10));
      setTotal(parseFloat(responseSearch.pagination.total));
      setPage((item) => item + 1);
    }
  };

  const fetchMoreData = async () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    const data = await search(jsCyber, cid, page);
    // console.log(`data`, data)
    if (data.result) {
      const result = reduceParticleArr(data.result, cid);
      setTimeout(() => {
        setDataAnswers((itemState) => ({ ...itemState, ...result }));
        setPage((itemPage) => itemPage + 1);
      }, 500);
    }
  };

  const feachCidTo = async () => {
    const response = await getToLink(cid);
    console.log(`response`, response);
    if (response !== null && response.txs && response.txs.length > 0) {
      // console.log('response To :>> ', response);
      setDataToLink(response.txs.reverse());
    }
  };

  const feachCidFrom = async () => {
    const response = await getFromLink(cid);
    if (response !== null && response.txs && response.txs.length > 0) {
      let addressCreator = '';
      if (response.txs[0].tx.value.msg[0].value.neuron) {
        addressCreator = response.txs[0].tx.value.msg[0].value.neuron;
      }
      if (response.txs[0].tx.value.msg[0].value.sender) {
        addressCreator = response.txs[0].tx.value.msg[0].value.sender;
      }
      const timeCreate = response.txs[0].timestamp;
      setCreator({
        address: addressCreator,
        timestamp: timeCreate,
      });
      const responseDataFromLink = response.txs.slice();
      responseDataFromLink.reverse();
      // console.log('responseDataFromLink :>> ', responseDataFromLink);
      setDataFromLink(responseDataFromLink);
    }
  };

  useEffect(() => {
    let dataTemp = {};
    const tempArr = [...dataToLink, ...dataFromLink];
    if (tempArr.length > 0) {
      tempArr.forEach((item) => {
        const subject = item.tx.value.msg[0].value.neuron;
        if (dataTemp[subject]) {
          dataTemp[subject].amount += 1;
        } else {
          dataTemp = {
            ...dataTemp,
            [subject]: {
              amount: 1,
            },
          };
        }
      });
      setCommunityData(dataTemp);
    }
  }, [dataToLink, dataFromLink]);

  return (
    <>
      <main className="block-body">
        {loading ? (
          <ContentIpfsCid
            loading={loading}
            statusFetching={statusFetching}
            status={status}
          />
        ) : (
          <ContentTab
            contentIpfs={contentIpfs}
            // typeContent={typeContent}
            // status={loadStatus}
            // gateway={gateway}
            // content={content}
            // text={text}
            cid={cid}
          />
        )}
        <Tablist
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(110px, 1fr))"
          gridGap="10px"
          marginTop={25}
          marginBottom={tab !== 'meta' ? 25 : 0}
          width="62%"
          marginX="auto"
        >
          <TabBtn
            text={
              <PaneWithPill
                caption="answers"
                count={dataAnswers.length}
                active={tab === 'answers'}
              />
            }
            isSelected={tab === 'answers'}
            to={`/ipfs/${cid}/answers`}
          />
          <TabBtn
            text={
              <PaneWithPill
                caption="discussion"
                count={dataToLink.length}
                active={tab === 'discussion'}
              />
            }
            isSelected={tab === 'discussion'}
            to={`/ipfs/${cid}`}
          />
          <TabBtn
            text="meta"
            isSelected={tab === 'meta'}
            to={`/ipfs/${cid}/meta`}
          />
        </Tablist>
        <Pane
          width="90%"
          marginX="auto"
          marginY={0}
          display="flex"
          flexDirection="column"
        >
          {tab === 'discussion' && (
            <DiscussionTab
              data={dataToLink}
              mobile={mobile}
              parent={queryParamsId}
            />
          )}
          {tab === 'answers' && (
            <AnswersTab
              data={dataAnswers}
              mobile={mobile}
              fetchMoreData={fetchMoreData}
              page={page}
              allPage={allPage}
              total={total}
              parent={queryParamsId}
            />
          )}
          {tab === 'meta' && (
            <>
              <Pane width="60%" marginX="auto" marginTop="25px" fontSize="18px">
                Creator
              </Pane>
              <Pane
                alignItems="center"
                width="60%"
                marginX="auto"
                justifyContent="center"
                display="flex"
                flexDirection="column"
              >
                <Link to={`/network/bostrom/contract/${creator.address}`}>
                  <Pane
                    alignItems="center"
                    marginX="auto"
                    justifyContent="center"
                    display="flex"
                  >
                    <Account
                      styleUser={{ flexDirection: 'column' }}
                      sizeAvatar="80px"
                      avatar
                      address={creator.address}
                    />
                  </Pane>
                </Link>
                {creator.timestamp.length > 0 && (
                  <Pane>
                    {dateFormat(creator.timestamp, 'dd/mm/yyyy, HH:MM:ss')}
                  </Pane>
                )}
              </Pane>
              <CommunityTab data={communityData} />
              <Pane
                width="60%"
                marginX="auto"
                marginBottom="15px"
                fontSize="18px"
              >
                Backlinks
              </Pane>
              <OptimisationTab
                data={dataBacklinks}
                mobile={mobile}
                parent={queryParamsId}
              />
              <Pane width="60%" marginX="auto" fontSize="18px">
                Meta
              </Pane>
              <MetaTab cid={cid} data={contentIpfs?.meta} />
            </>
          )}
        </Pane>
      </main>
      {!mobile && (tab === 'discussion' || tab === 'answers') && (
        <ActionBarContainer
          placeholder={
            tab == 'answers' ? 'add keywords, hash or file' : 'add message'
          }
          textBtn={tab == 'answers' ? 'add answer' : 'Comment'}
          keywordHash={cid}
          update={() => getLinks()}
        />
      )}
    </>
  );
}

export default Ipfs;
