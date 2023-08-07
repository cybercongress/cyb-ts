// TODO: Refactor this component - too heavy
import { Link, useParams } from 'react-router-dom';
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

enum Tab {
  Discussion = 'discussion',
  Answers = 'answers',
  Meta = 'meta',
}

function Ipfs() {
  const { cid, tab = Tab.Discussion } = useParams();
  const { status, content, source } = useQueueIpfsContent(cid, 1, cid);
  const { backlinks } = useGetBackLink(cid);
  const { creator } = useGetCreator(cid);
  const dataAnswer = useGetAnswers(cid);
  const dataDiscussion = useGetDiscussion(cid);
  const { community } = useGetCommunity(cid);
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
      name: Tab.Answers,
      content: (
        <Link to={`/ipfs/${cid}/answers`}>
          Answers {!!dataAnswer.total && <Pill text={dataAnswer.total} />}
        </Link>
      ),
    },
    {
      name: Tab.Discussion,
      content: (
        <Link to={`/ipfs/${cid}/`}>
          Discussion{' '}
          {!!dataDiscussion.total && <Pill text={dataDiscussion.total} />}
        </Link>
      ),
    },
    {
      name: Tab.Meta,
      content: <Link to={`/ipfs/${cid}/meta`}>Meta</Link>,
    },
  ];

  return (
    <>
      <main className="block-body">
        {/* <div
          style={{ fontSize: '8px', color: '#00edeb' }}
        >{`source: ${source} mime: ${content?.meta?.mime} size: ${content?.meta?.size} local: ${content?.meta?.local} status: ${status} cid: ${cid}`}</div> */}
        {(!status || status !== 'completed') && (
          <ContentIpfsCid loading status={status} />
        )}

        {status === 'completed' && (
          <ContainerGradientText
            userStyleContent={{
              minHeight: 250,
            }}
          >
            <ContentIpfs status={status} content={content} cid={cid} />
          </ContainerGradientText>
        )}

        <div className={styles.tabs}>
          <Carousel
            slides={slides.map((slide) => {
              return {
                title: slide.content,
              };
            })}
            activeStep={slides.findIndex((slide) => slide.name === tab)}
          />
        </div>

        <Pane
          width="90%"
          marginX="auto"
          marginY={0}
          display="flex"
          flexDirection="column"
        >
          {tab === Tab.Discussion && (
            <DiscussionTab
              dataDiscussion={dataDiscussion}
              mobile={mobile}
              parent={queryParamsId}
            />
          )}
          {tab === Tab.Answers && (
            <AnswersTab
              dataAnswer={dataAnswer}
              mobile={mobile}
              parent={queryParamsId}
            />
          )}
          {tab === Tab.Meta && (
            <MetaTab
              backlinks={backlinks}
              creator={creator}
              content={content}
              cid={cid}
              parent={queryParamsId}
              communityData={community}
            />
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
