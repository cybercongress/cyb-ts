import { useEffect, useRef, useState } from 'react';
import { getIPFSContent } from 'src/utils/ipfs/utils-ipfs';

import { IPFSContentMaybe } from '../utils/ipfs/ipfs';

import {
  QueueManager,
  QueueItemStatus,
} from '../services/QueueManager/QueueManager';

import useIpfs from './useIpfs';

const FETCH_LIMIT = 21;
const FETCH_TIMEOUT = 1000 * 60 * 1; // 10 sec

const queueManager = new QueueManager<IPFSContentMaybe>(
  FETCH_LIMIT,
  FETCH_TIMEOUT
);

window.qm = queueManager;

type UseIpfsContentReturn = {
  status?: string;
  content: IPFSContentMaybe;
};

function useQueueIpfsContent(
  cid: string,
  rank: number,
  parentId?: string
): UseIpfsContentReturn {
  const [status, setStatus] = useState<QueueItemStatus | undefined>();
  const [content, setContent] = useState<IPFSContentMaybe>();
  const prevParentIdRef = useRef<string | undefined>();
  const { node } = useIpfs();

  useEffect(() => {
    const callback = (
      cid: string,
      status: QueueItemStatus,
      result: IPFSContentMaybe
    ): void => {
      setStatus(status);

      if (status === 'completed') {
        setContent(result);
      }
    };

    if (node) {
      const controller = new AbortController();
      queueManager.enqueue(
        cid,
        () => getIPFSContent(node, cid, controller),
        callback,
        { controller, parent: parentId, priority: rank }
      );

      if (prevParentIdRef.current !== parentId) {
        if (prevParentIdRef.current) {
          queueManager.cancelByParent(prevParentIdRef.current);
        }
        prevParentIdRef.current = parentId;
      }
    }
  }, [node, cid, rank, parentId]);

  return { status, content };
}

export default useQueueIpfsContent;
