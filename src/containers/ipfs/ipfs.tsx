import { useParams } from 'react-router-dom';
import ContentIpfs, {
  getContentDetails,
} from 'src/components/contentIpfs/contentIpfs';
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

function Ipfs() {
  const { query = '' } = useParams();

  const [cid, setKeywordHash] = useState<string>(
    query.match(PATTERN_IPFS_HASH) ? query : ''
  );

  const { status, content } = useQueueIpfsContent(cid, 1, cid);
  const { creator } = useGetCreator(cid);

  const [rankInfo, setRankInfo] = useState<number>();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (query.match(PATTERN_IPFS_HASH)) {
      if (query !== cid) {
        setKeywordHash(query);
      }

      return;
    }

    (async () => {
      // TODO: handle error and types
      const keywordHashTemp = await getIpfsHash(encodeSlash(query));

      setKeywordHash(keywordHashTemp);
    })();
  }, [cid, query]);

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
      setRankInfo(Number(response.rank));
    })();
  }, [content, status, cid, queryClient]);

  const { setAdviser } = useAdviser();

  useEffect(() => {
    if (!ipfsDataDetails) {
      return;
    }

    setAdviser(
      <div className={styles.meta}>
        <div className={styles.left}>
          {ipfsDataDetails?.type}

          {rankInfo && (
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
  }, [ipfsDataDetails, creator, setAdviser, rankInfo, cid, content]);

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

        {status === 'completed' ? (
          <ContentIpfs status={status} content={content} cid={cid} />
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
