/* eslint-disable no-restricted-syntax */
import { useRef, useEffect, useState } from 'react';
import { IPFSContent } from 'src/utils/ipfs/ipfs';
import { useIpfs } from 'src/contexts/ipfs';
import { getIpfsGatewayUrl } from 'src/utils/ipfs/utils/utils-ipfs';

interface VideoPlayerProps {
  content: IPFSContent;
}

function VideoPlayerGatewayOnly({ content }: VideoPlayerProps) {
  const { node } = useIpfs();
  const [contentUrl, setContentUrl] = useState<string>('');
  useEffect(() => {
    const load = async () => {
      if (content.source === 'node') {
        setContentUrl(await getIpfsGatewayUrl(node, content.cid));
      } else if (content.source === 'gateway') {
        setContentUrl(content.contentUrl);
      } else {
        setContentUrl(URL.createObjectURL(new Blob([content.result])));
      }
    };
    load();
  }, [node]);

  return contentUrl ? (
    <video style={{ width: '100%' }} src={contentUrl} controls />
  ) : null;
  x;
}

export default VideoPlayerGatewayOnly;
