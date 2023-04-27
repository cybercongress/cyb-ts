import { useEffect, useRef, useState } from 'react';
import { QueueItemStatus } from 'src/services/QueueManager/QueueManager.d';
import { useIpfs } from 'src/contexts/ipfs';

import { IPFSContentMaybe, IpfsContentSource } from '../utils/ipfs/ipfs';

import QueueManager from '../services/QueueManager/QueueManager';

const queueManager = new QueueManager<IPFSContentMaybe>();

window.qm = queueManager;

type UseIpfsContentReturn = {
  status?: string;
  source?: IpfsContentSource;
  content: IPFSContentMaybe;
};

function useQueueIpfsContent(
  cid: string,
  rank: number,
  parentId?: string
): UseIpfsContentReturn {
  const [status, setStatus] = useState<QueueItemStatus | undefined>();
  const [source, setSource] = useState<IpfsContentSource | undefined>();
  const [content, setContent] = useState<IPFSContentMaybe>();
  const prevParentIdRef = useRef<string | undefined>();
  const [prevNodeType, setPrevNodeType] = useState<string | undefined>();
  const { node } = useIpfs();

  useEffect(() => {
    const callback = (
      cid: string,
      status: QueueItemStatus,
      source: IpfsContentSource,
      result: IPFSContentMaybe
    ): void => {
      setStatus(status);
      setSource(source);
      if (status === 'completed') {
        setContent(result);
      }
    };

    if (node) {
      if (prevNodeType !== node.nodeType) {
        queueManager.setNode(node);
        setPrevNodeType(node.nodeType);
      }
    }

    queueManager.enqueue(cid, callback, {
      parent: parentId,
      priority: rank,
    });

    if (prevParentIdRef.current !== parentId) {
      if (prevParentIdRef.current) {
        queueManager.cancelByParent(prevParentIdRef.current);
      }
      prevParentIdRef.current = parentId;
    }
  }, [node, cid, rank, parentId]);

  return { status, source, content };
}

export default useQueueIpfsContent;
