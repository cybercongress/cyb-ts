import { useParams } from 'react-router-dom';
import ContentIpfs from 'src/components/contentIpfs/contentIpfs';
import { useEffect, useMemo, useState } from 'react';
import { useAdviser } from 'src/features/adviser/context';
import { encodeSlash } from 'src/utils/utils';
import { PATTERN_IPFS_HASH } from 'src/constants/patterns';
import { getIpfsHash } from 'src/utils/ipfs/helpers';
import { useBackend } from 'src/contexts/backend/backend';

import { useScripting } from 'src/contexts/scripting/scripting';
import useParticle from 'src/hooks/useParticle';

import { Dots, MainContainer } from '../../components';
import ContentIpfsCid from './components/ContentIpfsCid';
import styles from './IPFS.module.scss';
import SearchResults from '../Search/SearchResults';
import AdviserMeta from './components/AdviserMeta/AdviserMeta';
import SoulCompanion from './components/SoulCompanion/SoulCompanion';

function Ipfs() {
  const { query = '' } = useParams();
  const [cid, setCid] = useState<string>('');
  const { details, status, content } = useParticle(cid);

  const { ipfsApi, isIpfsInitialized, isReady } = useBackend();
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
        ipfsApi!.addContent(query);
        setCid(cidFromQuery);
      })();
    }
  }, [isText, isReady, query, ipfsApi, isIpfsInitialized, clearMetaItems]);

  useEffect(() => {
    (async () => {
      if (details) {
        console.log(
          '---askCompanion',
          cid,
          details,
          details?.type,
          details?.text
        );
        await askCompanion(
          cid,
          details?.type,
          details?.text?.substring(0, 255)
        );
      }
    })();
  }, [cid, askCompanion, details]);

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
          type={details?.type}
          size={content?.meta?.size || details?.content?.length}
        />,
        'purple'
      );
    }
  }, [details, setAdviser, cid, content, status]);

  return (
    <MainContainer width="62%" resetMaxWidth>
      <div className={styles.wrapper}>
        {status === 'completed' && details ? (
          <ContentIpfs content={content} details={details} cid={cid} />
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
