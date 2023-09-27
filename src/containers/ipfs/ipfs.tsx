// TODO: Refactor this component - too heavy
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Pane, Tablist } from '@cybercongress/gravity';
import { useDevice } from 'src/contexts/device';
import ContentIpfs, {
  getContentDetails,
} from 'src/components/contentIpfs/contentIpfs';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import { useCallback, useEffect, useState } from 'react';
import { Account, ContainerGradientText, Rank } from '../../components';
import { DiscussionTab, AnswersTab, MetaTab } from './tab';
import ActionBarContainer from '../Search/ActionBarContainer';
import useGetBackLink from './hooks/useGetBackLink';
import useGetCreator from './hooks/useGetCreator';
import useGetAnswers from './hooks/useGetAnswers';
import useGetDiscussion from './hooks/useGetDiscussion';
import useGetCommunity from './hooks/useGetCommunity';
import ContentIpfsCid from './components/ContentIpfsCid';
import { Carousel } from '../temple/components';
import Pill from 'src/components/Pill/Pill';
import styles from './IPFS.module.scss';
import Backlinks from './components/backlinks';
import Dropdown from 'src/components/Dropdown/Dropdown';
import { Avatar } from '../portal/stateComponent';
import { useAdviser } from 'src/features/adviser/context';
import { useQueryClient } from 'src/contexts/queryClient';
import {
  coinDecimals,
  exponentialToDecimal,
  formatCurrency,
  timeSince,
} from 'src/utils/utils';
import { IPFSContentDetails } from 'src/utils/ipfs/ipfs';
import { PREFIXES } from './components/metaInfo';
import SearchResults from '../Search/SearchResults';

enum Tab {
  Discussion = 'discussion',
  Answers = 'answers',
  Meta = 'meta',
  Incoming = 'incoming',
  Outcoming = 'outcoming',
}

enum Filter {
  Rank = 'rank',
  Date = 'date',
}

function Ipfs() {
  const { cid = '', tab = Tab.Incoming } = useParams();
  const { status, content, source } = useQueueIpfsContent(cid, 1, cid);
  const { backlinks } = useGetBackLink(cid);
  const { creator } = useGetCreator(cid);
  const dataAnswer = useGetAnswers(cid);
  const dataDiscussion = useGetDiscussion(cid);
  const { community } = useGetCommunity(cid);
  const navigate = useNavigate();
  const location = useLocation();

  const [filter, setFilter] = useState(Filter.Rank);
  const [rankInfo, setRankInfo] = useState(null);

  const { isMobile: mobile } = useDevice();
  const queryClient = useQueryClient();

  console.log(content, source, status);

  // const { statusFetching, content, status, source, loading } =
  //   useGetIpfsContent(cid);

  const [ipfsDataDetails, setIpfsDatDetails] =
    useState<IPFSContentDetails>(undefined);

  useEffect(() => {
    // TODO: cover case with content === 'availableDownload'
    // && !content?.availableDownload

    if (status !== 'completed') {
      return;
    }
    (async () => {
      const details = await getContentDetails(cid, content);

      setIpfsDatDetails(details);

      const response = await queryClient?.rank(cid);
      const rank = coinDecimals(parseFloat(response.rank));
      const rankData = {
        rank: exponentialToDecimal(rank.toPrecision(3)),
        // grade: getRankGrade(rank),
      };
      setRankInfo(rankData.rank);
    })();
  }, [content, status, cid, queryClient]);

  const { setAdviser } = useAdviser();

  console.log(content, source, status, ipfsDataDetails);

  useEffect(() => {
    if (!ipfsDataDetails) {
      return;
    }

    setAdviser(
      <div className={styles.meta}>
        <div className={styles.left}>
          {ipfsDataDetails?.type} <span>with rank</span>
          {cid && <Rank hash={cid} rank={rankInfo} />}
          {/* <span className={styles.rank}>{rankInfo}</span> */}
          {/* <button>❓</button> */}
        </div>
        {creator && (
          <div className={styles.center}>
            <span className={styles.date}>
              {timeSince(Date.now() - Date.parse(creator.timestamp))} ago
            </span>
            <Account sizeAvatar="20px" address={creator.address} avatar />
          </div>
        )}
        <div className={styles.right}>
          {/* <span>🧼</span> */}
          <span>
            🟥 {formatCurrency(content?.meta?.size, 'B', 3, PREFIXES)}
          </span>
          <button disabled>🌓</button>
        </div>
      </div>,
      'purple'
    );

    // location.pathname because of tabs, need refactor
  }, [
    ipfsDataDetails,
    creator,
    setAdviser,
    rankInfo,
    cid,
    content,
    location.pathname,
  ]);

  const queryParamsId = `${cid}.${tab}`;

  const update = useCallback(() => {
    dataDiscussion.refetch();
    dataAnswer.refetch();
  }, [dataAnswer, dataDiscussion]);

  const slides = [
    {
      name: Tab.Meta,
      content: <Link to={`/ipfs/${cid}/meta`}>Meta</Link>,
    },
    {
      name: Tab.Incoming,
      content: (
        <>
          <Link to={`/ipfs/${cid}/incoming`} className={styles.tabLink}>
            incoming
          </Link>

          {!!backlinks?.length && <Pill text={backlinks?.length} />}
        </>
      ),
    },
    {
      name: Tab.Outcoming,
      content: (
        <>
          <Link to={`/ipfs/${cid}/outcoming`} className={styles.tabLink}>
            outcoming
          </Link>
          {!!dataAnswer.total && <Pill text={dataAnswer.total} />}
        </>
      ),
    },
  ];

  return (
    <>
      <main
        className="block-body"
        style={{
          paddingBottom: 30,
          width: '62%',
        }}
      >
        {/* <div
          style={{ fontSize: '8px', color: '#00edeb' }}
        >{`source: ${source} mime: ${content?.meta?.mime} size: ${content?.meta?.size} local: ${content?.meta?.local} status: ${status} cid: ${cid}`}</div> */}
        {(!status || status !== 'completed') && (
          <ContentIpfsCid loading status={status} />
        )}

        {status === 'completed' && (
          // <ContainerGradientText>
          <ContentIpfs status={status} content={content} cid={cid} />
          // </ContainerGradientText>
        )}
        {/* 
        <div className={styles.tabs}>
          <Carousel
            onChange={(index) => {
              // temp
              const slide = slides[index];
              if (slide) {
                switch (slide.name) {
                  case Tab.Outcoming:
                    navigate(`/ipfs/${cid}/outcoming`);
                    break;
                  case Tab.Meta:
                    navigate(`/ipfs/${cid}/meta`);
                    break;
                  case Tab.Incoming:
                    navigate(`/ipfs/${cid}/incoming`);
                    break;
                }
              }
            }}
            slides={slides.map((slide) => {
              return {
                title: slide.content,
              };
            })}
            activeStep={slides.findIndex((slide) => slide.name === tab)}
          />
        </div> */}

        {/* {tab === Tab.Outcoming && (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: '62%',
                margin: '10px auto',
              }}
            >
              <Dropdown
                options={[
                  {
                    label: 'Rank',
                    value: 'rank',
                  },
                  {
                    label: 'Date',
                    value: 'date',
                  },
                ]}
                value={filter}
                onChange={(value) => setFilter(value)}
              />
            </div>

            <br />
          </>
        )} */}

        {/* <Pane
          width="90%"
          marginX="auto"
          marginY={0}
          display="flex"
          flexDirection="column"
        >
          {tab === Tab.Outcoming && (
            <div>
              {filter === Filter.Rank ? (
                <AnswersTab
                  dataAnswer={dataAnswer}
                  mobile={mobile}
                  parent={queryParamsId}
                />
              ) : (
                <DiscussionTab
                  dataDiscussion={dataDiscussion}
                  mobile={mobile}
                  parent={queryParamsId}
                />
              )}
            </div>
          )}
          {tab === Tab.Meta && (
            <MetaTab
              // backlinks={backlinks}
              creator={creator}
              content={content}
              cid={cid}
              // parent={queryParamsId}
              communityData={community}
            />
          )}
          {tab === Tab.Incoming && (
            <Backlinks data={backlinks} parent={queryParamsId} />
          )}
        </Pane> */}
      </main>

      {/* <div
        style={{
          width: '90%',
          margin: '0 auto',
        }}
      > */}
      <SearchResults />
      {/* </div> */}

      {!mobile && (tab === 'discussion' || tab === 'answers') && (
        <ActionBarContainer
          placeholder={
            tab === 'answers' ? 'add keywords, hash or file' : 'add message'
          }
          textBtn={tab === 'answers' ? 'add answer' : 'Comment'}
          keywordHash={cid}
          update={update}
        />
      )}
    </>
  );
}

export default Ipfs;
