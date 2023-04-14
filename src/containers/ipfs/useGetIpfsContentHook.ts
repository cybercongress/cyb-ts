// TODO: refactor hook
import { useState, useEffect } from 'react';
import { IPFS } from 'kubo-rpc-client/types';
import { readStreamFully } from 'src/utils/ipfs/stream-utils';
import { parseRawIpfsData } from 'src/utils/ipfs/content-utils';
import {
  IPFSContentDetails,
  IPFSContentMeta,
  IPFSContentMaybe,
} from '../../utils/ipfs/ipfs.d';
import { getIPFSContent } from '../../utils/ipfs/utils-ipfs';

const useGetIpfsContent = (cid: string, nodeIpfs: IPFS) => {
  const [statusFetching, setStatusFetching] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<IPFSContentMeta | undefined>(undefined);
  useState<IPFSContentDetails>(undefined);
  const [contentDetails, setContentDetails] =
    useState<IPFSContentDetails>(undefined);

  useEffect(() => {
    const feachData = async (): Promise<void> => {
      setLoading(true);
      setStatusFetching('');

      const contentIpfs: IPFSContentMaybe = await getIPFSContent(
        nodeIpfs,
        cid,
        undefined,
        setStatusFetching
      );
      setMeta(contentIpfs?.meta);
      if (!contentIpfs) {
        setStatus('impossibleLoad');
      } else if (contentIpfs.availableDownload) {
        // setContentIpfs(contentIpfs);
        setStatus('availableDownload');
      } else if (contentIpfs.stream) {
        const rawData = await readStreamFully(cid, contentIpfs.stream);
        const details = parseRawIpfsData(rawData, contentIpfs.meta?.mime, cid);
        setContentDetails(details);
        setStatus('downloaded');
      }

      setLoading(false);
    };
    feachData();
  }, [cid, nodeIpfs]);

  return {
    contentDetails,
    meta,
    status,
    loading,
    statusFetching,
  };
};

export default useGetIpfsContent;
