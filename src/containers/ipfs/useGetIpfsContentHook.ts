// TODO: refactor hook
import { useState, useEffect } from 'react';
import { useIpfs } from 'src/contexts/ipfs';
import { QueueItemStatus } from 'src/services/QueueManager/QueueManager.d';
import { IPFSContentMaybe, IpfsContentSource } from '../../utils/ipfs/ipfs.d';
import { getIPFSContent } from '../../utils/ipfs/utils-ipfs';

const useGetIpfsContent = (cid: string) => {
  const { node } = useIpfs();
  const [statusFetching, setStatusFetching] = useState('');
  const [status, setStatus] = useState<QueueItemStatus | undefined>();
  const [source, setSource] = useState<IpfsContentSource | undefined>();
  const [content, setContent] = useState<IPFSContentMaybe>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const feachData = async (): Promise<void> => {
      setLoading(true);
      setStatusFetching('');
      setStatus('executing');

      const contentIpfs: IPFSContentMaybe = await getIPFSContent(
        node,
        cid,
        undefined,
        setStatusFetching
      );

      if (contentIpfs) {
        setStatus('completed');
        setSource(contentIpfs.source);
        setContent(contentIpfs);
      } else {
        setStatus('timeout');
      }

      setLoading(false);
    };
    feachData();
  }, [cid, node]);

  return {
    content,
    status,
    source,
    loading,
    statusFetching,
  };
};

export default useGetIpfsContent;
