import { useEffect, useState } from 'react';
import Iframe from 'src/components/Iframe/Iframe';
import { useIpfs } from 'src/contexts/ipfs';
import { getIpfsGatewayUrl } from 'src/utils/ipfs/utils-ipfs';

function DirectoryItem({ cid, search }: { cid: string; search?: boolean }) {
  const { node } = useIpfs();
  const [url, setUrl] = useState('');
  useEffect(() => {
    const loadUrl = async () => {
      const url = await getIpfsGatewayUrl(node, cid);
      setUrl(url);
    };

    loadUrl();
  }, [node, cid]);

  return <Iframe height={search ? '400px' : '700px'} url={url} />;
}

export default DirectoryItem;
