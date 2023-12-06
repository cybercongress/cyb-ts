import ContentIpfs from 'src/components/contentIpfs/contentIpfs';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import { useEffect, useState } from 'react';
import { useAdviser } from 'src/features/adviser/context';
import { parseArrayLikeToDetails } from 'src/services/ipfs/utils/content';
import { IPFSContentDetails } from 'src/services/ipfs/ipfs';
import { Dots } from 'src/components';
import ContentIpfsCid from '../ContentIpfsCid';
import AdviserMeta from '../AdviserMeta/AdviserMeta';

function IpfsContent({ cid }: { cid: string }) {
  const { fetchParticle, status, content } = useQueueIpfsContent(cid);
  const [ipfsDataDetails, setIpfsDatDetails] = useState<IPFSContentDetails>();

  const { setAdviser } = useAdviser();

  useEffect(() => {
    (async () => {
      cid && fetchParticle && (await fetchParticle(cid));
    })();
  }, [cid, fetchParticle]);

  useEffect(() => {
    if (status === 'completed') {
      (async () => {
        const details = await parseArrayLikeToDetails(
          content,
          cid
          // (progress: number) => console.log(`${cid} progress: ${progress}`)
        );
        setIpfsDatDetails(details);
      })();
    }
  }, [content, status, cid]);

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

  if (status === 'completed' && ipfsDataDetails !== null) {
    return (
      <ContentIpfs content={content} details={ipfsDataDetails} cid={cid} />
    );
  }

  return (
    <ContentIpfsCid
      loading={status === 'executing'}
      status={status}
      cid={cid}
    />
  );
}

export default IpfsContent;
