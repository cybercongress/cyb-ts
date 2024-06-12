import { useEffect, useState } from 'react';
import { useBackend } from 'src/contexts/backend/backend';
import useQueueIpfsContent from './useQueueIpfsContent';
import { IPFSContentDetails } from 'src/services/ipfs/types';
import { ParticleCid } from 'src/types/base';
import { parseArrayLikeToDetails } from 'src/services/ipfs/utils/content';
import { QueueItemStatus } from 'src/services/QueueManager/types';
import { Option } from 'src/types';

const useParticle = (
  cid: ParticleCid,
  parentId: Option<string> = undefined,
  rank: Option<number> = undefined
) => {
  const {
    fetchParticle,
    status: queueItemStatus,
    content,
  } = useQueueIpfsContent(parentId);
  const [details, setDetails] = useState<IPFSContentDetails>();
  const [status, setStatus] = useState<QueueItemStatus>('pending');
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (cid && fetchParticle) {
      setStatus('pending');
      setDetails(undefined);
      fetchParticle(cid, rank);
    }
  }, [cid, fetchParticle, rank]);

  useEffect(() => {
    if (queueItemStatus === 'completed') {
      const hiddenByRune = content?.mutation === 'hidden';
      setHidden(hiddenByRune);
      // TODO: exclude from parsing for hidden?
      parseArrayLikeToDetails(
        content,
        cid
        // (progress: number) => console.log(`${cid} progress: ${progress}`)
      ).then((details) => {
        setDetails(details);
        setStatus('completed');
      });
    } else {
      setStatus(queueItemStatus);
    }
  }, [content, queueItemStatus, cid]);

  return { status, details, hidden, content };
};

export default useParticle;
