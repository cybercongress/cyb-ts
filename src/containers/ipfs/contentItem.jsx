import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { SearchItem } from '@cybercongress/gravity';
import Iframe from 'react-iframe';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { getRankGrade, getPinsCid } from '../../utils/search/utils';
import CodeBlock from './codeBlock';
import { getTypeContent } from './useGetIpfsContentHook';
import db from '../../db';

const uint8ArrayConcat = require('uint8arrays/concat');
const all = require('it-all');
const FileType = require('file-type');

const ContentItem = ({ item, cid, nodeIpfs, grade, ...props }) => {
  const [content, setContent] = useState('');
  const [text, setText] = useState(cid);
  const [typeContent, setTypeContent] = useState('');
  const [status, setStatus] = useState('understandingState');
  const [link, setLink] = useState(`/ipfs/${cid}`);

  useEffect(() => {
    const feachData = async () => {
      setLink(`/ipfs/${cid}`);
      const dataIndexdDb = await db.table('cid').get({ cid });
      if (dataIndexdDb !== undefined && dataIndexdDb.content) {
        const contentCidDB = Buffer.from(dataIndexdDb.content);
        const dataTypeContent = await getTypeContent(contentCidDB, cid);
        // console.log('dataTypeContent', dataTypeContent);
        const {
          text: textContent,
          type,
          content: contentCid,
          link: linkContent,
        } = dataTypeContent;
        setText(textContent);
        setTypeContent(type);
        setContent(contentCid);
        setLink(linkContent);
        setStatus('downloaded');
      } else if (nodeIpfs !== null) {
        const responseDag = await nodeIpfs.dag.get(cid);
        // console.log(`responseDag`, responseDag);
        const meta = {
          type: 'file',
          size: 0,
          blockSizes: [],
          data: '',
        };
        const linksCid = [];
        if (responseDag.value.Links && responseDag.value.Links.length > 0) {
          responseDag.value.Links.forEach((itemResponseDag, index) => {
            if (itemResponseDag.Name.length > 0) {
              linksCid.push({
                name: itemResponseDag.Name,
                size: itemResponseDag.Tsize,
              });
            } else {
              linksCid.push(itemResponseDag.Tsize);
            }
          });
        }
        meta.size = responseDag.value.size;
        meta.blockSizes = linksCid;
        if (responseDag.value.size < 15 * 10 ** 6) {
          const responsePin = nodeIpfs.pin.add(cid);
          // console.log('responsePin', responsePin);

          // const cids = new CID(cid);
          const responseCat = uint8ArrayConcat(await all(nodeIpfs.cat(cid)));
          const dataFileType = await FileType.fromBuffer(responseCat);
          let mimeType = '';
          if (dataFileType !== undefined) {
            const { mime } = dataFileType;

            mimeType = mime;
          }
          const blob = new Blob([responseCat], { type: mimeType });
          const datagetPinsCid = await getPinsCid(cid, blob);
          // console.log(`datagetPinsCid`, cid, datagetPinsCid);
          const someVar = responseCat;
          meta.data = someVar;
          const ipfsContentAddtToInddexdDB = {
            cid,
            content: someVar,
            meta,
          };
          // await db.table('test').add(ipfsContentAddtToInddexdDB);
          db.table('cid').add(ipfsContentAddtToInddexdDB);
          const dataTypeContent = await getTypeContent(someVar, cid);
          const {
            text: textContent,
            type,
            content: contentCid,
            link: linkContent,
          } = dataTypeContent;
          setText(textContent);
          setTypeContent(type);
          setContent(contentCid);
          setLink(linkContent);
          setStatus('downloaded');
        } else {
          setStatus('availableDownload');
          setText(cid);
        }
      }
    };
    feachData();
  }, [cid, nodeIpfs]);

  return (
    <Link {...props} to={link}>
      <SearchItem
        key={cid}
        text={
          <div className="container-text-SearchItem">
            {/* {`${text}`} */}
            <ReactMarkdown
              children={text}
              rehypePlugins={[rehypeSanitize]}
              // skipHtml
              // escapeHtml
              // skipHtml={false}
              // astPlugins={[parseHtml]}
              // renderers={{ code: CodeBlock }}
              remarkPlugins={[remarkGfm]}

              // escapeHtml={false}
            />
          </div>
        }
        status={status}
        rank={item.rank ? item.rank : 'n/a'}
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
};

export default ContentItem;
