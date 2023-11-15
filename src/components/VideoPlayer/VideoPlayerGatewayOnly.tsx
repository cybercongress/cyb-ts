/* eslint-disable no-restricted-syntax */
import { useEffect, useState } from 'react';
import { IPFSContent } from 'src/utils/ipfs/ipfs';
import { useBackend } from 'src/contexts/backend';
import { CYBER_GATEWAY_URL } from 'src/services/ipfs/config';

interface VideoPlayerProps {
  content: IPFSContent;
}

function VideoPlayerGatewayOnly({ content }: VideoPlayerProps) {
  const { backendApi } = useBackend();
  const [contentUrl, setContentUrl] = useState<string>('');
  useEffect(() => {
    const load = async () => {
      if (content.source === 'node') {
        const { gatewayUrl } = (await backendApi!.ipfsApi.config()) || {
          gatewayUrl: CYBER_GATEWAY_URL,
        };
        setContentUrl(`${gatewayUrl}/ipfs/${content.cid}`);
      } else if (content.source === 'gateway') {
        setContentUrl(content.contentUrl);
      } else {
        setContentUrl(URL.createObjectURL(new Blob([content.result])));
      }
    };
    load();
  }, [backendApi, content]);

  return contentUrl ? (
    <video style={{ width: '100%' }} src={contentUrl} controls />
  ) : null;
  x;
}

export default VideoPlayerGatewayOnly;
