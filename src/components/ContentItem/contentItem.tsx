import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Iframe from 'react-iframe';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { $TsFixMe } from 'src/types/tsfix';
import useIpfs from 'src/hooks/useIpfs';
import SearchItem from '../SearchItem/searchItem';
import { getTypeContent } from '../../containers/ipfs/useGetIpfsContentHook';
import { getIPFSContent } from '../../utils/ipfs/utils-ipfs';

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
  const [content, setContent] = useState<string | undefined>(undefined);
  const [textPreview, setTextPreview] = useState<string | undefined>(cid);
  const [typeContent, setTypeContent] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState('understandingState');
  const [link, setLink] = useState(`/ipfs/${cid}`);
  const { node } = useIpfs();

  useEffect(() => {
    const feachData = async (): Promise<void> => {
      const dataResponseByCid = await getIPFSContent(node, cid);
      console.log('dataResponseByCid', dataResponseByCid);
      if (dataResponseByCid) {
        if (dataResponseByCid === 'availableDownload') {
          setStatus('availableDownload');
          setTextPreview(cid);
        } else if (!dataResponseByCid.data) {
          setStatus('Not Available');
          setTextPreview(cid);
        } else {
          // const { data } = dataResponseByCid;
          const dataTypeContent = await getTypeContent(
            dataResponseByCid.data,
            cid
          );

          const {
            text: textContent,
            type,
            content: contentCid,
            link: linkContent,
          } = dataTypeContent;

          setTextPreview(textContent);
          setTypeContent(type);
          setContent(contentCid);
          setLink(linkContent);
          setStatus('downloaded');
        }
      } else {
        setStatus('impossibleLoad');
      }
    };
    feachData();
  }, [cid, node]);

  return (
    <Link className={className} to={link}>
      <SearchItem
        key={cid}
        textPreview={
          <div className="container-text-SearchItem">
            <ReactMarkdown
              rehypePlugins={[rehypeSanitize]}
              // skipHtml
              // escapeHtml
              // skipHtml={false}
              // astPlugins={[parseHtml]}
              remarkPlugins={[remarkGfm]}

              // escapeHtml={false}
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
            src={content}
          />
        )}
        {content && typeContent === 'application/pdf' && (
          <Iframe
            width="100%"
            height="400px"
            className="iframe-SearchItem"
            url={content}
          />
        )}
      </SearchItem>
    </Link>
  );
}

export default ContentItem;
