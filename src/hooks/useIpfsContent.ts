import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getIPFSContent } from 'src/utils/ipfs/utils-ipfs';

import { IPFSContentMaybe } from '../utils/ipfs/ipfs.d';

import {
  QueueManager,
  QueueItemStatus,
} from '../services/QueueManager/QueueManager';

import useIpfs from './useIpfs';

const FETCH_LIMIT = 9;
const FETCH_TIMEOUT = 1000 * 10 * 1; // 10 sec

const queueManager = new QueueManager<IPFSContentMaybe>(
  FETCH_LIMIT,
  FETCH_TIMEOUT
);

window.qm = queueManager;

type UseIpfsContentReturn = {
  status?: string;
  content?: IPFSContentMaybe;
};

function useIpfsContent(
  cid: string,
  rank: number,
  parent: string
): UseIpfsContentReturn {
  const [status, setStatus] = useState<QueueItemStatus | undefined>();
  const [content, setContent] = useState<IPFSContentMaybe>();
  const { query } = useParams();
  const prevQueryRef = useRef<string | undefined>();
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
        controller,
        query,
        rank
      );
      // console.log('---query', queueManager.getStats());

      if (prevQueryRef.current !== query) {
        if (prevQueryRef.current) {
          queueManager.cancelByParent(prevQueryRef.current);
        }
        prevQueryRef.current = query;
      }
    }
  }, [node, cid, parent, rank, query]);

  return { status, content };
}

export default useIpfsContent;
