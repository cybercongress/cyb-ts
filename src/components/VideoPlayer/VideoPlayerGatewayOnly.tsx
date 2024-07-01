/* eslint-disable no-restricted-syntax */
import { useEffect, useState } from 'react';
import { IPFSContentDetails, IPFSContentMaybe } from 'src/services/ipfs/types';
import { useBackend } from 'src/contexts/backend/backend';
import { CYBER_GATEWAY_URL } from 'src/services/ipfs/config';

interface VideoPlayerProps {
  content: IPFSContentMaybe;
  details: IPFSContentDetails;
}

function VideoPlayerGatewayOnly({ content, details }: VideoPlayerProps) {
  const { ipfsApi } = useBackend();
  const [contentUrl, setContentUrl] = useState<string>('');
  useEffect(() => {
    const load = async () => {
      if (content?.source === 'node') {
        setContentUrl(`${CYBER_GATEWAY_URL}/ipfs/${content.cid}`);
      } else if (content?.source === 'gateway') {
        setContentUrl(content.contentUrl);
      } else if (details?.gateway) {
        setContentUrl(`${CYBER_GATEWAY_URL}${details.link}`);
      } else {
        setContentUrl(URL.createObjectURL(new Blob([content.result])));
      }
    };
    load();
  }, [ipfsApi, content]);

  return contentUrl ? (
    <video style={{ width: '100%' }} src={contentUrl} controls />
  ) : null;
  x;
}

export default VideoPlayerGatewayOnly;
