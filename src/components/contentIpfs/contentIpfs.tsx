import { IPFSContentDetails, IPFSContentMaybe } from 'src/services/ipfs/types';
import { CYBER_GATEWAY } from 'src/constants/config';
import VideoPlayerGatewayOnly from '../VideoPlayer/VideoPlayerGatewayOnly';
import GatewayContent from './component/gateway';
import TextMarkdown from '../TextMarkdown';
import LinkHttp from './component/link';
import Pdf from '../PDF';
import Img from './component/img';
import Audio from './component/Audio/Audio';

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
  return <GatewayContent url={`${CYBER_GATEWAY}/ipfs/${cid}`} />;
}

function DownloadableItem({ cid, search }: { cid: string; search?: boolean }) {
  if (search) {
    return <div>{`${cid} (gateway)`}</div>;
  }
  return <GatewayContent url={`${CYBER_GATEWAY}/ipfs/${cid}`} />;
}

type ContentTabProps = {
  details: IPFSContentDetails;
  content?: IPFSContentMaybe;
  cid: string;
  search?: boolean;
};

function ContentIpfs({ details, content, cid, search }: ContentTabProps) {
  const contentType = details?.type;

  return (
    <div>
      {/* <DebugContentInfo
        cid={cid}
        source={content?.source}
        content={content}
        status={status}
      /> */}
      {/* Default */}

      {!details?.type && <TextMarkdown preview>{cid.toString()}</TextMarkdown>}

      {content?.availableDownload && (
        <DownloadableItem search={search} cid={cid} />
      )}

      {contentType === 'audio' && content && <Audio content={content} />}

      {details && (
        <>
          {contentType === 'video' && (
            <VideoPlayerGatewayOnly content={content} details={details} />
          )}
          {contentType === 'text' && (
            <TextMarkdown preview={search}>
              {search ? details.text : details.content}
            </TextMarkdown>
          )}
          {contentType === 'image' && <Img content={details.content} />}
          {contentType === 'pdf' && details.content && (
            <Pdf content={details.content} />
          )}
          {contentType === 'link' && (
            <LinkHttp url={details.content!} preview={search} />
          )}
          {contentType === 'other' && (
            <OtherItem search={search} cid={cid} content={details.content} />
          )}
        </>
      )}
    </div>
  );
}
export default ContentIpfs;
