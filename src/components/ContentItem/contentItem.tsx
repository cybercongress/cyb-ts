// TODO: refactor needed
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Iframe from 'react-iframe';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { $TsFixMe } from 'src/types/tsfix';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import { IPFSContentDetails, IPFSContentMaybe } from 'src/utils/ipfs/ipfs';
import { parseRawIpfsData } from 'src/utils/ipfs/content-utils';
import { readStreamFully } from 'src/utils/ipfs/stream-utils';

import SearchItem from '../SearchItem/searchItem';

import { getRankGrade } from '../../utils/search/utils';

type ContentItemProps = {
  item: $TsFixMe;
  cid: string;
  grade?: $TsFixMe;
  className?: string;
  parent?: string;
};

const getContentDetails = async (
  cid: string,
  content: IPFSContentMaybe
): Promise<IPFSContentDetails> => {
  if (content?.stream) {
    const rawData = await readStreamFully(cid, content.stream);

    const details = parseRawIpfsData(rawData, content.meta?.mime, cid);
    // console.log('---ContentItem useEffect---', details, cid);

    return details;
  }
  return undefined;
};

function ContentItem({
  item,
  cid,
  grade,
  parent: parentId,
  className,
}: ContentItemProps): JSX.Element {
  const [ipfsDataDetails, setIpfsDatDetails] =
    useState<IPFSContentDetails>(undefined);
  const { status, content } = useQueueIpfsContent(cid, item.rank, parentId);

  useEffect(() => {
    // TODO: cover case with content === 'availableDownload'
    if (status === 'completed') {
      getContentDetails(cid, content).then(setIpfsDatDetails);
    }
  }, [content, status, cid]);

  return (
    <Link className={className} to={`/ipfs/${cid}`}>
      <SearchItem
        key={cid}
        textPreview={
          // NEED TO move out from here this code or encapsulate whole logic into SearchItem
          ipfsDataDetails?.type === 'text' && (
            <div className="container-text-SearchItem">
              <ReactMarkdown
                rehypePlugins={[rehypeSanitize]}
                remarkPlugins={[remarkGfm]}
              >
                {ipfsDataDetails?.text}
              </ReactMarkdown>
            </div>
          )
        }
        status={status}
        grade={
          item.rank
            ? getRankGrade(item.rank)
            : grade || { from: 'n/a', to: 'n/a', value: 'n/a' }
        }
      >
        {status !== 'completed' && <div>{cid}</div>}
        {ipfsDataDetails?.type === 'link' && (
          <div>{ipfsDataDetails.content}</div>
        )}
        {ipfsDataDetails?.type === 'image' && (
          <img
            style={{ width: '100%', paddingTop: 10 }}
            alt="img"
            src={ipfsDataDetails?.content}
          />
        )}
        {ipfsDataDetails?.type === 'pdf' && (
          <Iframe
            width="100%"
            height="400px"
            className="iframe-SearchItem"
            url={ipfsDataDetails?.content}
          />
        )}
      </SearchItem>
    </Link>
  );
}

export default ContentItem;
