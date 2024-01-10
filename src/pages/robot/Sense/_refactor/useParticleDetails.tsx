import { useEffect, useState } from 'react';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import { IPFSContentDetails } from 'src/services/ipfs/ipfs';
import { parseArrayLikeToDetails } from 'src/services/ipfs/utils/content';

function useParticleDetails(cid: string, { skip = false } = {}) {
  const { fetchParticle, status, content } = useQueueIpfsContent(cid);
  const [details, setDetails] = useState<IPFSContentDetails>();

  useEffect(() => {
    if (skip) {
      return;
    }

    fetchParticle?.(cid);
  }, [cid, fetchParticle, skip]);

  useEffect(() => {
    if (status !== 'completed') {
      return;
    }
    (async () => {
      const details = await parseArrayLikeToDetails(content, cid);
      setDetails(details);
    })();
  }, [content, status, cid]);

  return {
    data: details,
    // FIXME:
    loading: !details,
  };
}

export default useParticleDetails;
