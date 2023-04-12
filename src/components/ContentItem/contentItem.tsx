import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Iframe from 'react-iframe';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { $TsFixMe } from 'src/types/tsfix';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import { IPFSContentWithType } from 'src/utils/ipfs/ipfs';

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
  const [ipfsData, setIpfData] = useState<IPFSContentWithType>(undefined);
  const { status, content } = useQueueIpfsContent(cid, item.rank, parentId);

  useEffect(() => {
    // TODO: cover case with content === 'availableDownload'
    if (status === 'completed' && content && content !== 'availableDownload') {
      setIpfData(content.data);
    }
  }, [content, status]);

  return (
    <Link className={className} to={`/ipfs/${cid}`}>
      <SearchItem
        key={cid}
        textPreview={
          <div className="container-text-SearchItem">
            <ReactMarkdown
              rehypePlugins={[rehypeSanitize]}
              remarkPlugins={[remarkGfm]}
            >
              {ipfsData?.text || cid}
            </ReactMarkdown>
          </div>
        }
        status={status}
        grade={
          item.rank
            ? getRankGrade(item.rank)
            : grade || { from: 'n/a', to: 'n/a', value: 'n/a' }
        }
      >
        {ipfsData?.type === 'image' && (
          <img
            style={{ width: '100%', paddingTop: 10 }}
            alt="img"
            src={ipfsData?.content}
          />
        )}
        {ipfsData?.type === 'application/pdf' && (
          <Iframe
            width="100%"
            height="400px"
            className="iframe-SearchItem"
            url={ipfsData?.content}
          />
        )}
      </SearchItem>
    </Link>
  );
}

export default ContentItem;
