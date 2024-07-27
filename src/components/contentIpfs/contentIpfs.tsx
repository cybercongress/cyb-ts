import { CYBER_GATEWAY } from 'src/constants/config';
import { CYBER_GATEWAY_URL } from 'src/services/ipfs/config';
import { IPFSContent, IPFSContentDetails } from 'src/services/ipfs/types';
import { Option } from 'src/types';
import EPubView from '../EPubView/EPubView';
import Pdf from '../PDF';
import TextMarkdown from '../TextMarkdown';
import VideoPlayerGatewayOnly from '../VideoPlayer/VideoPlayerGatewayOnly';
import Audio from './component/Audio/Audio';
import GatewayContent from './component/gateway';
import Img from './component/img';
import LinkHttp from './component/link';

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

function HtmlItem({ cid }: { cid: string }) {
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
  content?: Option<IPFSContent>;
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
          {contentType === 'html' && <HtmlItem cid={content?.cid} />}
          {contentType === 'epub' && (
            <EPubView
              url={`${CYBER_GATEWAY_URL}/ipfs/${cid}`}
              search={search}
            />
          )}
          {['other', 'cid'].some((i) => i === contentType) && (
            <OtherItem search={search} cid={cid} content={details.content} />
          )}
        </>
      )}
    </div>
  );
}

export default ContentIpfs;
