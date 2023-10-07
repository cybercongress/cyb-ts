import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  QueueItemAsyncResult,
  QueueItemOptions,
  QueueItemStatus,
} from 'src/services/QueueManager/QueueManager.d';
import { useIpfs } from 'src/contexts/ipfs';
import { queueManager } from 'src/services/QueueManager/QueueManager';

import {
  IPFSContent,
  IPFSContentMaybe,
  IpfsContentSource,
} from 'src/services/ipfs/ipfs';
import { useBackend } from 'src/contexts/backend';

import QueueManager from '../services/QueueManager/QueueManager';

type UseIpfsContentReturn = {
  status?: QueueItemStatus;
  source?: IpfsContentSource;
  content: IPFSContentMaybe;
  clear: () => void;
  cancel: (cid: string) => void;
  fetchParticle: (cid: string, rank?: number) => void;
  fetchParticleAsync: (
    cid: string
  ) => Promise<QueueItemAsyncResult<IPFSContentMaybe> | undefined>;
};

function useQueueIpfsContent(parentId?: string): UseIpfsContentReturn {
  const [status, setStatus] = useState<QueueItemStatus | undefined>();
  const [source, setSource] = useState<IpfsContentSource | undefined>();
  const [content, setContent] = useState<IPFSContentMaybe>();
  const prevParentIdRef = useRef<string | undefined>();
  const [prevNodeType, setPrevNodeType] = useState<string | undefined>();
  const { node } = useIpfs();
  const { backendApi } = useBackend();

  const fetchParticle = useCallback(
    (cid: string, rank?: number) => {
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

      queueManager.enqueue(cid, callback, {
        parent: parentId,
        priority: rank || 0,
        viewPortPriority: 0,
      });
    },
    [parentId]
  );

  const fetchParticleAsync = useCallback(
    (cid: string, options?: QueueItemOptions) =>
      queueManager.enqueueAndWait(cid, options),
    []
  );

  useEffect(() => {
    queueManager.setBackendApi(backendApi!);
  }, [backendApi]);

  useEffect(() => {
    console.log('----q node', node, node?.nodeType, prevNodeType);
    if (node && prevNodeType !== node.nodeType) {
      queueManager.setNode(node);
      setPrevNodeType(node.nodeType);
    }
  }, [node]);

  useEffect(() => {
    if (prevParentIdRef.current !== parentId) {
      console.log(
        '----q node prevParentIdRef',
        parentId,
        prevParentIdRef.current
      );

      if (prevParentIdRef.current) {
        queueManager.cancelByParent(prevParentIdRef.current);
      }
      prevParentIdRef.current = parentId;
    }
  }, [parentId]);

  return {
    status,
    source,
    content,
    cancel: (cid: string) => queueManager.cancel(cid),
    clear: queueManager.clear.bind(queueManager),
    fetchParticle,
    fetchParticleAsync,
  };
}

export default useQueueIpfsContent;
