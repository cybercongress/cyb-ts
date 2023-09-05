// TODO: Refactor this component - too heavy
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Pane, Tablist } from '@cybercongress/gravity';
import { useDevice } from 'src/contexts/device';
import ContentIpfs from 'src/components/contentIpfs/contentIpfs';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import { useCallback, useState } from 'react';
import { ContainerGradientText } from '../../components';
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
  const { cid, tab = Tab.Discussion } = useParams();
  const { status, content, source } = useQueueIpfsContent(cid, 1, cid);
  const { backlinks } = useGetBackLink(cid);
  const { creator } = useGetCreator(cid);
  const dataAnswer = useGetAnswers(cid);
  const dataDiscussion = useGetDiscussion(cid);
  const { community } = useGetCommunity(cid);
  const navigate = useNavigate();

  const [filter, setFilter] = useState(Filter.Rank);

  // const { statusFetching, content, status, source, loading } =
  //   useGetIpfsContent(cid);
  const { isMobile: mobile } = useDevice();
  const queryParamsId = `${cid}.${tab}`;

  const update = useCallback(() => {
    dataDiscussion.refetch();
    dataAnswer.refetch();
  }, [dataAnswer, dataDiscussion]);

  const slides = [
    {
      name: Tab.Outcoming,
      content: (
        <Link to={`/ipfs/${cid}/outcoming`}>
          outcoming ~ {!!dataAnswer.total && <Pill text={dataAnswer.total} />}
        </Link>
      ),
    },
    {
      name: Tab.Meta,
      content: <Link to={`/ipfs/${cid}/meta`}>Meta</Link>,
    },
    {
      name: Tab.Incoming,
      content: <Link to={`/ipfs/${cid}/incoming`}>incoming ~</Link>,
    },
  ];

  return (
    <>
      <main
        className="block-body"
        style={{
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
          <ContainerGradientText>
            <ContentIpfs status={status} content={content} cid={cid} />
          </ContainerGradientText>
        )}

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
        </div>

        {tab === Tab.Outcoming && (
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
        )}

        <Pane
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
        </Pane>
      </main>
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
