import { useParams } from 'react-router-dom';
import ContentIpfs from 'src/components/contentIpfs/contentIpfs';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { useAdviser } from 'src/features/adviser/context';
import { encodeSlash, formatCurrency, timeSince } from 'src/utils/utils';
import { IPFSContentDetails } from 'src/utils/ipfs/ipfs';
import { PATTERN_IPFS_HASH } from 'src/utils/config';
import { getIpfsHash } from 'src/utils/search/utils';
import { Account, Rank } from '../../components';
import useGetCreator from './hooks/useGetCreator';
import ContentIpfsCid from './components/ContentIpfsCid';
import styles from './IPFS.module.scss';
import { PREFIXES } from './components/metaInfo';
import SearchResults from '../Search/SearchResults';
import { parseArrayLikeToDetails } from 'src/services/ipfs/utils/content';
import cx from 'classnames';

function Ipfs() {
  const { query = '' } = useParams();

  const [cid, setKeywordHash] = useState<string>(
    query.match(PATTERN_IPFS_HASH) ? query : ''
  );

  const { fetchParticle, status, content } = useQueueIpfsContent(cid);
  const { creator } = useGetCreator(cid);

  const [rankInfo, setRankInfo] = useState<number>();
  const [ipfsDataDetails, setIpfsDatDetails] =
    useState<IPFSContentDetails>(null);

  const queryClient = useQueryClient();
  const { setAdviser } = useAdviser();

  useEffect(() => {
    (async () => {
      if (!cid || cid !== query) {
        setKeywordHash((await getIpfsHash(encodeSlash(query))) as string);
      }
    })();
  }, [cid, query]);

  useEffect(() => {
    (async () => {
      cid && fetchParticle && (await fetchParticle(cid));
    })();
  }, [cid, fetchParticle]);

  useEffect(() => {
    // TODO: cover case with content === 'availableDownload'
    // && !content?.availableDownload

    if (status !== 'completed') {
      return;
    }
    (async () => {
      const details = await parseArrayLikeToDetails(
        content,
        cid
        // (progress: number) => console.log(`${cid} progress: ${progress}`)
      );
      setIpfsDatDetails(details);

      const response = await queryClient?.rank(cid);
      setRankInfo(Number(response.rank));
    })();
  }, [content, status, cid, queryClient]);

  useEffect(() => {
    if (['error', 'timeout', 'not_found'].includes(status)) {
      setAdviser(`Ipfs loading error, status: ${status}`);
    } else if (['pending', 'executing'].includes(status)) {
      setAdviser('Loading...', 'yellow');
    } else if (ipfsDataDetails) {
      setAdviser(
        <div className={styles.meta}>
          <div className={styles.left}>
            {ipfsDataDetails?.type}

            {!!rankInfo && (
              <div className={styles.rank}>
                with rank
                <span>{rankInfo.toLocaleString().replaceAll(',', ' ')}</span>
                <Rank hash={cid} rank={rankInfo} />
              </div>
            )}
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
            <span>
              🟥 {formatCurrency(content?.meta?.size, 'B', 0, PREFIXES)}
            </span>
            <button disabled>🌓</button>
          </div>
        </div>,
        'purple'
      );
    }
  }, [ipfsDataDetails, creator, setAdviser, rankInfo, cid, content, status]);

  return (
    <>
      <main
        className={cx('block-body', styles.wrapper)}
        style={{
          paddingBottom: 30,
          width: '62%',
        }}
      >
        {/* <div
          style={{ fontSize: '8px', color: '#00edeb' }}
        >{`source: ${source} mime: ${content?.meta?.mime} size: ${content?.meta?.size} local: ${content?.meta?.local} status: ${status} cid: ${cid}`}</div> */}

        {status === 'completed' && ipfsDataDetails !== null ? (
          <ContentIpfs content={content} details={ipfsDataDetails} cid={cid} />
        ) : (
          <ContentIpfsCid loading={status === 'executing'} status={status} />
        )}
      </main>

      <SearchResults />
    </>
  );
}

export default Ipfs;

// const update = useCallback(() => {
//   dataDiscussion.refetch();
//   dataAnswer.refetch();
// }, [dataAnswer, dataDiscussion]);

// {!mobile && (tab === 'discussion' || tab === 'answers') && (
//   <ActionBarContainer
//     placeholder={
//       tab === 'answers' ? 'add keywords, hash or file' : 'add message'
//     }
//     textBtn={tab === 'answers' ? 'add answer' : 'Comment'}
//     keywordHash={cid}
//     update={update}
//   />
// )}
