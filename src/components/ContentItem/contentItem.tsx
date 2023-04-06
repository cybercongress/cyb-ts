import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Iframe from 'react-iframe';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { $TsFixMe } from 'src/types/tsfix';
import useIpfsContent from 'src/hooks/useIpfsContent';

import SearchItem from '../SearchItem/searchItem';
import { getTypeContent } from '../../containers/ipfs/useGetIpfsContentHook';

import { getRankGrade } from '../../utils/search/utils';

type ContentItemProps = {
  item: $TsFixMe;
  cid: string;
  grade?: $TsFixMe;
  className?: string;
};

function ContentItem({
  item,
  cid,
  grade,
  className,
}: ContentItemProps): JSX.Element {
  const [textPreview, setTextPreview] = useState<string | undefined>(cid);
  const [typeContent, setTypeContent] = useState<string | undefined>(undefined);
  const [ipfsContent, setIpfsContent] = useState<$TsFixMe>(undefined);
  const [link, setLink] = useState(`/ipfs/${cid}`);

  const { status, content } = useIpfsContent(cid, item.rank, '');

  useEffect(() => {
    const feachData = async (): Promise<void> => {
      // console.log('dataResponseByCid', content, status);
      if (content) {
        if (content === 'availableDownload' || !content.data) {
          setTextPreview(cid);
        } else {
          const dataTypeContent = await getTypeContent(content.data, cid);
          const {
            text: textContent,
            type,
            content: dataContent,
            link: linkContent,
          } = dataTypeContent;

          setTextPreview(textContent);
          setTypeContent(type);
          setIpfsContent(dataContent);
          setLink(linkContent);
        }
      }
    };
    feachData();
  }, [content, status, cid]);

  return (
    <Link className={className} to={link}>
      <SearchItem
        key={cid}
        textPreview={
          <div className="container-text-SearchItem">
            <ReactMarkdown
              rehypePlugins={[rehypeSanitize]}
              remarkPlugins={[remarkGfm]}
            >
              {textPreview || ''}
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
        {typeContent === 'image' && (
          <img
            style={{ width: '100%', paddingTop: 10 }}
            alt="img"
            src={ipfsContent}
          />
        )}
        {content && typeContent === 'application/pdf' && (
          <Iframe
            width="100%"
            height="400px"
            className="iframe-SearchItem"
            url={ipfsContent}
          />
        )}
      </SearchItem>
    </Link>
  );
}

export default ContentItem;
