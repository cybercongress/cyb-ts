import { useParams } from 'react-router-dom';
import ContentIpfs from 'src/components/contentIpfs/contentIpfs';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import { useEffect, useMemo, useState } from 'react';
import { useAdviser } from 'src/features/adviser/context';
import { encodeSlash } from 'src/utils/utils';
import { PATTERN_IPFS_HASH } from 'src/constants/patterns';
import { getIpfsHash } from 'src/utils/ipfs/helpers';
import { parseArrayLikeToDetails } from 'src/services/ipfs/utils/content';
import { IPFSContentDetails } from 'src/services/ipfs/types';
import { useBackend } from 'src/contexts/backend/backend';

import { useScripting } from 'src/contexts/scripting/scripting';

import { Dots, MainContainer } from '../../components';
import ContentIpfsCid from './components/ContentIpfsCid';
import styles from './IPFS.module.scss';
import SearchResults from '../Search/SearchResults';
import AdviserMeta from './components/AdviserMeta/AdviserMeta';
import SoulCompanion from './components/SoulCompanion/SoulCompanion';

function Ipfs() {
  const { query = '' } = useParams();
  const [cid, setCid] = useState<string>('');

  const { fetchParticle, status, content } = useQueueIpfsContent(cid);
  const { ipfsApi, isIpfsInitialized, isReady } = useBackend();
  const [ipfsDataDetails, setIpfsDatDetails] = useState<IPFSContentDetails>();
  const {
    status: runeStatus,
    metaItems,
    askCompanion,
    clearMetaItems,
  } = useScripting();
  const { setAdviser } = useAdviser();

  const isText = useMemo(() => !query.match(PATTERN_IPFS_HASH), [query]);
  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!isText) {
      setCid(query);
    } else if (isIpfsInitialized) {
      (async () => {
        clearMetaItems();
        const cidFromQuery = (await getIpfsHash(encodeSlash(query))) as string;
        await ipfsApi!.addContent(query);
        setIpfsDatDetails(undefined);
        setCid(cidFromQuery);
      })();
    }
  }, [isText, isReady, query, ipfsApi, isIpfsInitialized, clearMetaItems]);

  useEffect(() => {
    (async () => {
      cid && fetchParticle && (await fetchParticle(cid));
    })();
  }, [cid, fetchParticle]);
  useEffect(() => {
    if (status === 'completed') {
      (async () => {
        console.log('----content', content, cid);
        const details = await parseArrayLikeToDetails(
          content,
          cid
          // (progress: number) => console.log(`${cid} progress: ${progress}`)
        );
        setIpfsDatDetails(details);
      })();
    }
  }, [content, status, cid, askCompanion]);

  useEffect(() => {
    (async () => {
      if (ipfsDataDetails) {
        console.log(
          '---askCompanion',
          cid,
          ipfsDataDetails,
          ipfsDataDetails?.type,
          ipfsDataDetails?.text
        );
        await askCompanion(
          cid,
          ipfsDataDetails?.type,
          ipfsDataDetails?.text?.substring(0, 255)
        );
      }
    })();
  }, [cid, askCompanion, ipfsDataDetails]);

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

  return (
    <MainContainer width="62%" resetMaxWidth>
      <div className={styles.wrapper}>
        {status === 'completed' && ipfsDataDetails ? (
          <ContentIpfs content={content} details={ipfsDataDetails} cid={cid} />
        ) : isText ? (
          <ContentIpfs
            details={{
              type: 'text',
              text: query,
              content: query,
              cid,
              gateway: false,
            }}
            cid={cid}
          />
        ) : (
          <ContentIpfsCid
            loading={status === 'executing'}
            status={status}
            cid={cid}
          />
        )}
      </div>
      <SoulCompanion status={runeStatus} metaItems={metaItems} />
      <SearchResults />
    </MainContainer>
  );
}

export default Ipfs;
