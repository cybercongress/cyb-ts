import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Iframe from 'react-iframe';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { getRankGrade } from '../../utils/search/utils';
import { getTypeContent } from '../../containers/ipfs/useGetIpfsContentHook';
import { getContentByCid } from '../../utils/ipfs/utils-ipfs';
import SearchItem from '../SearchItem/searchItem';
import useIpfs from 'src/hooks/useIpfs';

function ContentItem({ item, cid, grade, ...props }) {
  const [content, setContent] = useState(null);
  const [textPreview, setTextPreview] = useState(cid);
  const [typeContent, setTypeContent] = useState('');
  const [status, setStatus] = useState('understandingState');
  const [link, setLink] = useState(`/ipfs/${cid}`);
  const { node } = useIpfs();

  useEffect(() => {
    const feachData = async () => {
      let responseData = null;

      const dataResponseByCid = await getContentByCid(node, cid);
      if (dataResponseByCid !== undefined) {
        if (dataResponseByCid === 'availableDownload') {
          setStatus('availableDownload');
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
          console.log('----dataResponseByCid', dataTypeContent, textContent);

          //TODO: dublicate code that is in the useGetIpfsContentHook -> refactor
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
    <Link {...props} to={link}>
      <SearchItem
        key={cid}
        textPreview={
          <div className="container-text-SearchItem">
            <ReactMarkdown
              // eslint-disable-next-line react/no-children-prop
              children={textPreview}
              rehypePlugins={[rehypeSanitize]}
              // skipHtml
              // escapeHtml
              // skipHtml={false}
              // astPlugins={[parseHtml]}
              remarkPlugins={[remarkGfm]}

              // escapeHtml={false}
            />
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
        {typeContent === 'application/pdf' && (
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
