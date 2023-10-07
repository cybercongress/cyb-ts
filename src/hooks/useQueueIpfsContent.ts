import { useEffect, useRef, useState } from 'react';
import { QueueItemStatus } from 'src/services/QueueManager/QueueManager.d';
import { useIpfs } from 'src/contexts/ipfs';
import { queueManager } from 'src/services/QueueManager/QueueManager';

import { IPFSContentMaybe, IpfsContentSource } from 'src/services/ipfs/ipfs';

import QueueManager from '../services/QueueManager/QueueManager';
import { useBackend } from 'src/contexts/backend';

type UseIpfsContentReturn = {
  status?: QueueItemStatus;
  source?: IpfsContentSource;
  content: IPFSContentMaybe;
  clear: () => void;
  cancel: (cid: string) => void;
};

function useQueueIpfsContent(
  cid?: string,
  rank?: number,
  parentId?: string
): UseIpfsContentReturn {
  const [status, setStatus] = useState<QueueItemStatus | undefined>();
  const [source, setSource] = useState<IpfsContentSource | undefined>();
  const [content, setContent] = useState<IPFSContentMaybe>();
  const prevParentIdRef = useRef<string | undefined>();
  const [prevNodeType, setPrevNodeType] = useState<string | undefined>();
  const { node } = useIpfs();
  const { backendApi } = useBackend();

  useEffect(() => {
    queueManager.setBackendApi(backendApi!);
  }, [backendApi]);

  useEffect(() => {
    if (node) {
      if (prevNodeType !== node.nodeType) {
        queueManager.setNode(node);
        setPrevNodeType(node.nodeType);
      }
    }
  }, [node, prevNodeType]);

  useEffect(() => {
    const callback = (
      cid: string,
      status: QueueItemStatus,
      source: IpfsContentSource,
      result: IPFSContentMaybe
    ): void => {
      // if (!node) {
      //   return;
      // }
      setStatus(status);
      setSource(source);
      if (status === 'completed') {
        setContent(result);
      }
    };

    if (cid) {
      queueManager.enqueue(cid, callback, {
        parent: parentId,
        priority: rank || 0,
        viewPortPriority: 0,
      });
    }
    if (prevParentIdRef.current !== parentId) {
      if (prevParentIdRef.current) {
        queueManager.cancelByParent(prevParentIdRef.current);
      }
      prevParentIdRef.current = parentId;
    }
  }, [cid, rank, parentId, node]);

  return {
    status,
    source,
    content,
    cancel: (cid: string) => queueManager.cancel(cid),
    clear: queueManager.clear.bind(queueManager),
  };
}

export default useQueueIpfsContent;
