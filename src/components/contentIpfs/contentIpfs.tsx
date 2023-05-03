import { IPFSContentDetails, IPFSContentMaybe } from 'src/utils/ipfs/ipfs';
import { useEffect, useState } from 'react';
import { parseRawIpfsData } from 'src/utils/ipfs/content-utils';
import { CYBER } from 'src/utils/config';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import GatewayContent from './component/gateway';
import TextMarkdown from '../TextMarkdown';
import LinkHttp from './component/link';
import Pdf from '../pdf';
import Img from './component/img';

const getContentDetails = async (
  cid: string,
  content: IPFSContentMaybe
): Promise<IPFSContentDetails> => {
  if (content?.result) {
    const details = await parseRawIpfsData(
      content.result,
      content.meta?.mime,
      cid
      // (progress: number) => console.log(`${cid} progress: ${progress}`)
    );

    return details;
  }
  return undefined;
};

type ContentTabProps = {
  content: IPFSContentMaybe;
  status: string | undefined;
  cid: string;
  search?: boolean;
};

function ContentIpfs({ status, content, cid, search }: ContentTabProps) {
  const [ipfsDataDetails, setIpfsDatDetails] =
    useState<IPFSContentDetails>(undefined);

  useEffect(() => {
    // TODO: cover case with content === 'availableDownload'
    if (status === 'completed' && !content?.availableDownload) {
      getContentDetails(cid, content).then(setIpfsDatDetails);
    }
  }, [content, status, cid]);

  if (content?.availableDownload && search) {
    <div>{cid.toString()}</div>;
  }

  if (content?.availableDownload && !search) {
    return <GatewayContent url={`${CYBER.CYBER_GATEWAY}/ipfs/${cid}`} />;
  }

  if (ipfsDataDetails?.type === 'text') {
    return (
      <TextMarkdown fullWidth={search}>
        {search ? ipfsDataDetails.text : ipfsDataDetails.content}
      </TextMarkdown>
    );
  }

  if (ipfsDataDetails?.type === 'image') {
    return <Img content={ipfsDataDetails.content} />;
  }

  if (ipfsDataDetails?.type === 'pdf') {
    return <Pdf content={ipfsDataDetails.content} />;
  }

  if (ipfsDataDetails?.type === 'link') {
    return <LinkHttp content={ipfsDataDetails.content} preview />;
  }

  if (content && ipfsDataDetails?.type === 'video') {
    return <VideoPlayer content={content} />;
  }

  if (content && ipfsDataDetails?.type === 'other' && !search) {
    return <GatewayContent url={`${CYBER.CYBER_GATEWAY}/ipfs/${cid}`} />;
  }

  if (content && ipfsDataDetails?.type === 'other' && search) {
    return (
      <TextMarkdown fullWidth={search}>{ipfsDataDetails.content}</TextMarkdown>
    );
  }

  return <div>{cid.toString()}</div>;
}

export default ContentIpfs;
