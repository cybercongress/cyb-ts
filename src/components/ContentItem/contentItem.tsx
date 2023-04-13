// TODO: refactor needed
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Iframe from 'react-iframe';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { $TsFixMe } from 'src/types/tsfix';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import { IPFSContentDetails } from 'src/utils/ipfs/ipfs';
import { parseRawIpfsData } from 'src/utils/ipfs/content-utils';
import { readStreamDummy } from 'src/utils/ipfs/stream-utils';

import SearchItem from '../SearchItem/searchItem';

import { getRankGrade } from '../../utils/search/utils';

type ContentItemProps = {
  item: $TsFixMe;
  cid: string;
  grade?: $TsFixMe;
  className?: string;
  parent?: string;
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
    if (status === 'completed' && content && content.stream) {
      const fetchData = async (): Promise<void> => {
        const rawData = await readStreamDummy(cid, content.stream);
        const details = parseRawIpfsData(rawData, content.meta.mime, cid);

        setIpfsDatDetails(details);
      };

      fetchData();
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
                {ipfsDataDetails?.text || cid}
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
