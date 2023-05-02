import { IPFSContentDetails, IPFSContentMaybe } from 'src/utils/ipfs/ipfs';
import { useEffect, useState } from 'react';
import { parseRawIpfsData } from 'src/utils/ipfs/content-utils';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import Iframe from 'react-iframe';
import rehypeStringify from 'rehype-stringify';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import { CYBER } from 'src/utils/config';

// {
//   ipfsDataDetails?.type === 'link' && <div>{ipfsDataDetails.content}</div>;
// }

function Img({ content }) {
  return (
    <img style={{ width: '100%', paddingTop: 10 }} alt="img" src={content} />
  );
}

function Pdf({ content }) {
  return (
    <Iframe
      width="100%"
      height="400px"
      className="iframe-SearchItem"
      url={content}
      // TODO: USE loaded content
      // url={`${CYBER.CYBER_GATEWAY}${ipfsDataDetails?.link}`}
    />
  );
}

function TextContainer({
  children,
  fullWidth,
}: {
  children: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? 'container-text-SearchItem' : 'markdown'}>
      <ReactMarkdown
        rehypePlugins={[rehypeStringify, rehypeSanitize]}
        remarkPlugins={[remarkGfm]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

function GatewayContent({ url }: { url: string }) {
  return (
    <div
      style={{
        textAlign: 'center',
        backgroundColor: '#000',
        minHeight: 'calc(100vh - 70px)',
        paddingBottom: '5px',
        height: '1px',
        width: '100%',
      }}
    >
      <Iframe
        width="100%"
        height="100%"
        // loading={<Dots />}
        id="iframeCid"
        className="iframe-SearchItem"
        src={url}
        style={{
          backgroundColor: '#fff',
        }}
      />
    </div>
  );
}

function LinkHttp({ content, preview }) {
  return (
    <>
      <div>{content}</div>
      {preview && <GatewayContent url={content} />}
    </>
  );
}

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
    if (status === 'completed') {
      getContentDetails(cid, content).then(setIpfsDatDetails);
    }
  }, [content, status, cid]);

  if (ipfsDataDetails?.type === 'text') {
    return (
      <TextContainer fullWidth={search}>
        {search ? ipfsDataDetails.text : ipfsDataDetails.content}
      </TextContainer>
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
    console.log('"other"');
    console.log('content', content);
    return <GatewayContent url={`${CYBER.CYBER_GATEWAY}/ipfs/${cid}`} />;
  }

  if (content && ipfsDataDetails?.type === 'other' && search) {
    return (
      <TextContainer fullWidth={search}>
        {ipfsDataDetails.content}
      </TextContainer>
    );
  }

  return <div>{cid.toString()}</div>;
}

export default ContentIpfs;
