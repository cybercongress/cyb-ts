import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  QueueItemAsyncResult,
  QueueItemOptions,
  QueueItemStatus,
} from 'src/services/QueueManager/types';

import {
  FetchWithDetailsFunc,
  IPFSContentMaybe,
  IpfsContentSource,
} from 'src/services/ipfs/ipfs';
import { useBackend } from 'src/contexts/backend';
import { proxy } from 'comlink';

type UseIpfsContentReturn = {
  isReady: boolean;
  status?: QueueItemStatus;
  source?: IpfsContentSource;
  content: IPFSContentMaybe;
  clear?: () => Promise<void>;
  cancel?: (cid: string) => Promise<void>;
  fetchParticle?: (cid: string, rank?: number) => Promise<void>;
  fetchParticleAsync?: (
    cid: string
  ) => Promise<QueueItemAsyncResult<IPFSContentMaybe> | undefined>;
  fetchWithDetails?: FetchWithDetailsFunc;
};

function useQueueIpfsContent(parentId?: string): UseIpfsContentReturn {
  const [status, setStatus] = useState<QueueItemStatus>();
  const [source, setSource] = useState<IpfsContentSource | undefined>();
  const [content, setContent] = useState<IPFSContentMaybe>();
  const prevParentIdRef = useRef<string | undefined>();

  const { backendApi, ipfsNode, isIpfsInitialized } = useBackend();

  const fetchParticle = useCallback(
    async (cid: string, rank?: number) => {
      setContent(undefined);
      setStatus('pending');
      setSource(undefined);

      const callback = (
        cid: string,
        status: QueueItemStatus,
        source: IpfsContentSource,
        result: IPFSContentMaybe
      ) => {
        setStatus(status);
        setSource(source);
        if (status === 'completed') {
          (async () => Promise.resolve(result).then(setContent))();
        }
      };
      await backendApi?.ipfsApi.enqueue(cid, proxy(callback), {
        parent: parentId,
        priority: rank || 0,
        viewPortPriority: 0,
      });
    },
    [parentId, backendApi]
  );

  const fetchParticleAsync = useCallback(
    async (cid: string, options?: QueueItemOptions) =>
      backendApi!.ipfsApi.enqueueAndWait(cid, options),
    [backendApi]
  );

  useEffect(() => {
    if (prevParentIdRef.current !== parentId) {
      if (prevParentIdRef.current) {
        backendApi!.ipfsApi.dequeueByParent(prevParentIdRef.current);
      }
      prevParentIdRef.current = parentId;
    }
  }, [parentId, backendApi]);

  return {
    isReady: !!backendApi,
    status,
    source,
    content,
    cancel: backendApi
      ? (cid: string) => backendApi!.ipfsApi.dequeue(cid)
      : undefined,
    clear: backendApi
      ? async () => backendApi!.ipfsApi.clearQueue()
      : undefined,
    fetchParticle: backendApi ? fetchParticle : undefined,
    fetchParticleAsync: backendApi ? fetchParticleAsync : undefined,
    fetchWithDetails: ipfsNode ? ipfsNode.fetchWithDetails : undefined,
  };
}

export default useQueueIpfsContent;
