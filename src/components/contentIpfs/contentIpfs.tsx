import {
  IPFSContentDetails,
  IPFSContentMaybe,
  IpfsContentType,
} from 'src/utils/ipfs/ipfs';
import { useEffect, useState } from 'react';
import { parseRawIpfsData } from 'src/utils/ipfs/utils/content-utils';
import { CYBER } from 'src/utils/config';
import VideoPlayerGatewayOnly from '../VideoPlayer/VideoPlayerGatewayOnly';
import GatewayContent from './component/gateway';
import TextMarkdown from '../TextMarkdown';
import LinkHttp from './component/link';
import Pdf from '../PDF';
import Img from './component/img';
// import DebugContentInfo from '../DebugContentInfo/DebugContentInfo';
import Audio from './component/Audio/Audio';

export const getContentDetails = async (
  cid: string,
  content: IPFSContentMaybe
): Promise<IPFSContentDetails> => {
  // if (content?.result) {

  const details = await parseRawIpfsData(
    content?.result,
    content?.meta?.mime,
    cid
    // (progress: number) => console.log(`${cid} progress: ${progress}`)
  );

  return details;
  // }
  // return undefined;
};

function OtherItem({
  content,
  cid,
  search,
}: {
  cid: string;
  search?: boolean;
  content?: string;
}) {
  if (search) {
    return (
      <TextMarkdown preview={search}>{content || `${cid} (n/a)`}</TextMarkdown>
    );
  }
  return <GatewayContent url={`${CYBER.CYBER_GATEWAY}/ipfs/${cid}`} />;
}

function DownloadableItem({ cid, search }: { cid: string; search?: boolean }) {
  if (search) {
    return <div>{`${cid} (gateway)`}</div>;
  }
  return <GatewayContent url={`${CYBER.CYBER_GATEWAY}/ipfs/${cid}`} />;
}

type ContentTabProps = {
  content: IPFSContentMaybe;
  status: string | undefined;
  cid: string;
  search?: boolean;
  setType?: (type: IpfsContentType) => void;
};

function ContentIpfs({
  status,
  content,
  cid,
  search,
  setType,
}: ContentTabProps) {
  const [ipfsDataDetails, setIpfsDatDetails] =
    useState<IPFSContentDetails>(undefined);

  useEffect(() => {
    // TODO: cover case with content === 'availableDownload'
    // && !content?.availableDownload

    if (status === 'completed') {
      (async () => {
        const details = await getContentDetails(cid, content);
        setIpfsDatDetails(details);

        if (setType && details?.type) {
          setType(details.type);
        }
      })();
    }
  }, [content, status, cid]);

  const contentType = ipfsDataDetails?.type;

  return (
    <div>
      {/* <DebugContentInfo
        cid={cid}
        source={content?.source}
        content={content}
        status={status}
      /> */}
      {/* Default */}

      {!content && <div>{cid.toString()}</div>}

      {content?.availableDownload && (
        <DownloadableItem search={search} cid={cid} />
      )}

      {content?.meta.mime?.includes('audio') && <Audio content={content} />}

      {contentType === 'video' && content && (
        <VideoPlayerGatewayOnly content={content} />
      )}

      {ipfsDataDetails && (
        <>
          {contentType === 'text' && (
            <TextMarkdown preview={search}>
              {search ? ipfsDataDetails.text : ipfsDataDetails.content}
            </TextMarkdown>
          )}
          {contentType === 'image' && <Img content={ipfsDataDetails.content} />}
          {contentType === 'pdf' && ipfsDataDetails.content && (
            <Pdf content={ipfsDataDetails.content} />
          )}
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
    </div>
  );
}
export default ContentIpfs;
