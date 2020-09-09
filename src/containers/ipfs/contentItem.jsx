import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { SearchItem } from '@cybercongress/gravity';
import Iframe from 'react-iframe';
import { getRankGrade } from '../../utils/search/utils';
import CodeBlock from './codeBlock';
import useGetIpfsContent from './useGetIpfsContentHook';

const htmlParser = require('react-markdown/plugins/html-parser');

const parseHtml = htmlParser({
  isValidNode: node => node.type !== 'script',
});

const ContentItem = ({ item, cid, nodeIpfs, ...props }) => {
  const data = useGetIpfsContent(cid, nodeIpfs);
  const [content, setContent] = useState('');
  const [text, setText] = useState(cid);
  const [typeContent, setTypeContent] = useState('');
  const [status, setStatus] = useState('understandingState');
  const [link, setLink] = useState(`/ipfs/${cid}`);

  useEffect(() => {
    setContent(data.content);
    setText(data.text);
    setTypeContent(data.typeContent);
    setStatus(data.status);
    setLink(data.link);
  }, [data]);

  return (
    <Link {...props} to={link}>
      <SearchItem
        key={cid}
        text={
          <div className="container-text-SearchItem">
            <ReactMarkdown
              source={text}
              escapeHtml={false}
              skipHtml={false}
              astPlugins={[parseHtml]}
              renderers={{ code: CodeBlock }}
              // plugins={[toc]}
              // escapeHtml={false}
            />
          </div>
        }
        status={status}
        rank={item.rank ? item.rank : 'n/a'}
        grade={
          item.rank
            ? getRankGrade(item.rank)
            : { from: 'n/a', to: 'n/a', value: 'n/a' }
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
};

export default ContentItem;
