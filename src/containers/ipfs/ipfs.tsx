// TODO: Refactor this component - too heavy
import { useParams } from 'react-router-dom';
import { Pane, Tablist } from '@cybercongress/gravity';
import { useDevice } from 'src/contexts/device';
import ContentIpfs from 'src/components/contentIpfs/contentIpfs';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import { TabBtn } from '../../components';
import { DiscussionTab, AnswersTab, MetaTab } from './tab';
import ActionBarContainer from '../Search/ActionBarContainer';
import useGetBackLink from './hooks/useGetBackLink';
import useGetCreator from './hooks/useGetCreator';
import useGetAnswers from './hooks/useGetAnswers';
import useGetDiscussion from './hooks/useGetDiscussion';
import useGetCommunity from './hooks/useGetCommunity';
import ContentIpfsCid from './components/ContentIpfsCid';
import PaneWithPill from './components/PaneWithPill';

function Ipfs() {
  const { cid, tab = 'discussion' } = useParams();
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

  return (
    <>
      <main className="block-body">
        <div
          style={{ fontSize: '8px', color: '#00edeb' }}
        >{`source: ${source} mime: ${content?.meta?.mime} size: ${content?.meta?.size} local: ${content?.meta?.local} status: ${status} cid: ${cid}`}</div>
        {(!status || status !== 'completed') && (
          <ContentIpfsCid loading status={status} />
        )}
        {status === 'completed' && (
          <ContentIpfs status={status} content={content} cid={cid} />
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
                count={dataAnswer.total || ''}
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
                count={dataDiscussion.total || ''}
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
              dataDiscussion={dataDiscussion}
              mobile={mobile}
              parent={queryParamsId}
            />
          )}
          {tab === 'answers' && (
            <AnswersTab
              dataAnswer={dataAnswer}
              mobile={mobile}
              parent={queryParamsId}
            />
          )}
          {tab === 'meta' && (
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
          // update={() => getLinks()}
        />
      )}
    </>
  );
}

export default Ipfs;
