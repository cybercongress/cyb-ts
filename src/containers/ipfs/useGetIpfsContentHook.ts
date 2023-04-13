// TODO: refactor hook
import { useState, useEffect } from 'react';
import { IPFS } from 'kubo-rpc-client/types';
import { getIPFSContent } from '../../utils/ipfs/utils-ipfs';
import { IPFSContentMaybe } from '../../utils/ipfs/ipfs.d';

const useGetIpfsContent = (cid: string, nodeIpfs: IPFS) => {
  // const [content, setContent] = useState('');
  // const [text, setText] = useState<string | undefined>(cid);
  // const [typeContent, setTypeContent] = useState<string | undefined>('');
  // const [status, setStatus] = useState('understandingState');
  // const [link, setLink] = useState(`/ipfs/${cid}`);
  // const [gateway, setGateway] = useState(false);
  const [statusFetching, setStatusFetching] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  // const [metaData, setMetaData] = useState<IPFSContentMeta>({
  //   type: 'file',
  //   size: 0,
  //   blockSizes: [],
  //   data: '',
  // });

  const [contentIpfs, setContentIpfs] = useState<IPFSContentMaybe>(undefined);

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
      console.log('content useGetIpfsContentHook', contentIpfs);
      setContentIpfs(contentIpfs);
      if (!contentIpfs) {
        setStatus('impossibleLoad');
        setLoading(false);
      } else if (contentIpfs === 'availableDownload') {
        // setContent(cid);
        // setGateway(true);
        setContentIpfs(contentIpfs);
        setStatus('availableDownload');
        // }
        //   setText(cid);
      } else if (contentIpfs.details) {
        //   const { data, meta } = contentIpfs;
        //   setTypeContent(data.type);
        //   setContent(data.content);
        //   setText(data.text);
        //   setLink(data.link);
        //   setGateway(data.gateway);
        setStatus('downloaded');
        //   setMetaData(meta);
        setLoading(false);
      }
    };
    feachData();
  }, [cid, nodeIpfs]);

  return {
    // content,
    // text,
    // typeContent,
    // status,
    // link,
    // gateway,
    // metaData,
    contentIpfs,
    status,
    loading,
    statusFetching,
  };
};

export default useGetIpfsContent;
