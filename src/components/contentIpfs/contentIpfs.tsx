import { IPFSContentDetails, IPFSContentMaybe } from 'src/utils/ipfs/ipfs';
import { useEffect, useState } from 'react';
import { parseRawIpfsData } from 'src/utils/ipfs/content-utils';
import VideoPlayerGatewayOnly from './items/VideoPlayer/VideoPlayerGatewayOnly';
import TextMarkdown from './items/TextMarkdown';
import LinkHttp from './items/link';
import Pdf from './items/pdf';
import Img from './items/img';
import OtherItem from './items/OtherItem';
import DownloadableItem from './items/DownloadableItem';
import DirectoryItem from './DirectoryItem/DirectoryItem';
import DebugContentInfo from '../DebugContentInfo/DebugContentInfo';

const getContentDetails = async (
  cid: string,
  content: IPFSContentMaybe
): Promise<IPFSContentDetails> => {
  // if (content?.result) {

  const details = await parseRawIpfsData(
    cid,
    content
    // (progress: number) => console.log(`${cid} progress: ${progress}`)
  );

  return details;
  // }
  // return undefined;
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
    //  && !content.details
    if (status === 'completed' && content) {
      // console.log('-----', status, content, cid);

      // && !content?.availableDownload
      getContentDetails(cid, content).then(setIpfsDatDetails);
    } else {
      setIpfsDatDetails(content?.details);
    }
  }, [content, status, cid]);

  if (!content) {
    return <div>{cid}</div>;
  }

  const { contentType } = content;

  return (
    <>
      <DebugContentInfo
        cid={cid}
        source={content?.source}
        content={content}
        status={status}
      />
      {/* Directory or ipfs hosted site(index.html) */}
      {(content?.contentType === 'directory' ||
        (content?.contentType === 'html' && !content?.meta.type)) && (
        <DirectoryItem cid={cid} search={search} />
      )}

      {content?.availableDownload && (
        <DownloadableItem search={search} cid={cid} />
      )}

      {contentType === 'video' && <VideoPlayerGatewayOnly content={content} />}

      {['text', 'xml', 'cid', 'particle'].indexOf(contentType) !== -1 &&
        ipfsDataDetails && (
          <TextMarkdown fullWidth={search}>
            {search ? ipfsDataDetails?.text : ipfsDataDetails?.content}
          </TextMarkdown>
        )}

      {ipfsDataDetails?.content && contentType && (
        <>
          {contentType === 'image' && <Img content={ipfsDataDetails.content} />}
          {contentType === 'pdf' && <Pdf content={ipfsDataDetails.content} />}
          {contentType === 'link' && (
            <LinkHttp content={ipfsDataDetails.content} preview />
          )}
          {contentType === 'other' && (
            <OtherItem
              search={search}
              cid={cid}
              content={ipfsDataDetails.content}
            />
          )}
        </>
      )}
    </>
  );
}
export default ContentIpfs;
