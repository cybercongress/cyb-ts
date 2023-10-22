import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  QueueItemAsyncResult,
  QueueItemOptions,
  QueueItemStatus,
} from 'src/services/QueueManager/QueueManager.d';

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
  const [status, setStatus] = useState<QueueItemStatus | undefined>();
  const [source, setSource] = useState<IpfsContentSource | undefined>();
  const [content, setContent] = useState<IPFSContentMaybe>();
  const prevParentIdRef = useRef<string | undefined>();
  const [prevNodeType, setPrevNodeType] = useState<string | undefined>();
  // const { node } = useIpfs();
  // const [ipfsQueue, setIpfsQueue] = useState<
  //   Remote<QueueManager<IPFSContentMaybe>> | undefined
  // >();
  const { backendApi, ipfsNode } = useBackend();

  // useEffect(() => {
  //   (async () => {
  //     const q = await backendApi?.ipfsQueue;
  //     setIpfsQueue(q);
  //   })();
  // }, [backendApi]);

  const fetchParticle = useCallback(
    async (cid: string, rank?: number) => {
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

      await backendApi!.ipfsQueueFetch(cid, proxy(callback), {
        parent: parentId,
        priority: rank || 0,
        viewPortPriority: 0,
      });
    },
    [parentId, backendApi]
  );

  const fetchParticleAsync = useCallback(
    async (cid: string, options?: QueueItemOptions) =>
      backendApi!.ipfsQueueFetchAsync(cid, options),
    [backendApi]
  );

  useEffect(() => {
    if (prevParentIdRef.current !== parentId) {
      if (prevParentIdRef.current) {
        backendApi!.ipfsQueueCancelByParent(prevParentIdRef.current);
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
      ? (cid: string) => backendApi!.ipfsQueueCancel(cid)
      : undefined,
    clear: backendApi ? async () => backendApi!.ipfsQueueClear() : undefined,
    fetchParticle: backendApi ? fetchParticle : undefined,
    fetchParticleAsync: backendApi ? fetchParticleAsync : undefined,
    fetchWithDetails: ipfsNode ? ipfsNode.fetchWithDetails : undefined,
  };
}

export default useQueueIpfsContent;
