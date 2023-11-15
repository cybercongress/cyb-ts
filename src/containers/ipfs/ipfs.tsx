import { useParams } from 'react-router-dom';
import ContentIpfs from 'src/components/contentIpfs/contentIpfs';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { useAdviser } from 'src/features/adviser/context';
import { encodeSlash } from 'src/utils/utils';
import { PATTERN_IPFS_HASH } from 'src/utils/config';
import { getIpfsHash } from 'src/utils/search/utils';
import { parseArrayLikeToDetails } from 'src/services/ipfs/utils/content';
import { IPFSContentDetails } from 'src/services/ipfs/ipfs';
import { Dots, MainContainer } from '../../components';
import ContentIpfsCid from './components/ContentIpfsCid';
import styles from './IPFS.module.scss';
import SearchResults from '../Search/SearchResults';
import AdviserMeta from './components/AdviserMeta/AdviserMeta';
import { useBackend } from 'src/contexts/backend';

function Ipfs() {
  const { query = '' } = useParams();

  const [cid, setKeywordHash] = useState<string>('');

  const { fetchParticle, status, content } = useQueueIpfsContent(cid);
  const { ipfsNode } = useBackend();
  const [ipfsDataDetails, setIpfsDatDetails] = useState<IPFSContentDetails>();

  const queryClient = useQueryClient();
  const { setAdviser } = useAdviser();

  useEffect(() => {
    (async () => {
      if (cid !== query) {
        if (query.match(PATTERN_IPFS_HASH)) {
          setKeywordHash(query);
        } else {
          const cidFromQuery = (await getIpfsHash(
            encodeSlash(query)
          )) as string;
          if (cidFromQuery !== cid) {
            await ipfsNode?.addContent(query);
            setKeywordHash(cidFromQuery);
          }
        }
      }
    })();
  }, [cid, query, ipfsNode]);

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
    })();
  }, [content, status, cid, queryClient]);

  useEffect(() => {
    if (!status) {
      return;
    }

    if (['error', 'timeout', 'not_found'].includes(status)) {
      if (status === 'not_found') {
        setAdviser('no information about particle', 'red');
        return;
      }
      setAdviser(`IPFS loading error, status: ${status}`, 'red');
    } else if (['pending', 'executing'].includes(status)) {
      setAdviser(
        <>
          loading <Dots />
        </>,
        'yellow'
      );
    } else if (status === 'completed') {
      setAdviser(
        <AdviserMeta
          cid={cid}
          type={ipfsDataDetails?.type}
          size={content?.meta?.size || ipfsDataDetails?.content?.length}
        />,
        'purple'
      );
    }
  }, [ipfsDataDetails, setAdviser, cid, content, status]);

  console.debug(status, cid, content, ipfsDataDetails);

  return (
    <MainContainer width="62%" resetMaxWidth>
      <div className={styles.wrapper}>
        {status === 'completed' && ipfsDataDetails !== null ? (
          <ContentIpfs content={content} details={ipfsDataDetails} cid={cid} />
        ) : (
          <ContentIpfsCid
            loading={status === 'executing'}
            status={status}
            cid={cid}
          />
        )}
      </div>

      <SearchResults />
    </MainContainer>
  );
}

export default Ipfs;
