import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  QueueItemAsyncResult,
  QueueItemOptions,
  QueueItemStatus,
} from 'src/services/QueueManager/QueueManager.d';
import { useIpfs } from 'src/contexts/ipfs';
import { queueManager } from 'src/services/QueueManager/QueueManager';

import {
  FetchParticleDetailsDirect,
  IPFSContentMaybe,
  IpfsContentSource,
  IpfsContentType,
} from 'src/services/ipfs/ipfs';
import { useBackend } from 'src/contexts/backend';
import { getIPFSContent } from 'src/services/ipfs/utils/utils-ipfs';
import { parseArrayLikeToDetails } from 'src/services/ipfs/utils/content';

type UseIpfsContentReturn = {
  isReady: boolean;
  status?: QueueItemStatus;
  source?: IpfsContentSource;
  content: IPFSContentMaybe;
  clear: () => void;
  cancel: (cid: string) => void;
  fetchParticle?: (cid: string, rank?: number) => void;
  fetchParticleAsync?: (
    cid: string
  ) => Promise<QueueItemAsyncResult<IPFSContentMaybe> | undefined>;
  fetchParticleDetailsDirect?: FetchParticleDetailsDirect;
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

  const fetchParticleDetailsDirect = useCallback(
    async (cid: string, parseAs?: IpfsContentType) => {
      const response = await getIPFSContent(cid, node!);

      const details = response?.result
        ? await parseArrayLikeToDetails(
            response.result,
            response.meta.mime,
            cid
          )
        : undefined;
      return !parseAs
        ? details
        : details?.type === parseAs
        ? details
        : undefined;
    },
    [node]
  );

  useEffect(() => {
    queueManager.setBackendApi(backendApi!);
  }, [backendApi]);

  useEffect(() => {
    if (node && prevNodeType !== node.nodeType) {
      queueManager.setNode(node);
      setPrevNodeType(node.nodeType);
    }
  }, [node, prevNodeType]);

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
    isReady: !!node,
    status,
    source,
    content,
    cancel: (cid: string) => queueManager.cancel(cid),
    clear: queueManager.clear.bind(queueManager),
    fetchParticle: node ? fetchParticle : undefined,
    fetchParticleAsync: node ? fetchParticleAsync : undefined,
    fetchParticleDetailsDirect: node ? fetchParticleDetailsDirect : undefined,
  };
}

export default useQueueIpfsContent;
