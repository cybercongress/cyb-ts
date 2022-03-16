import React from 'react';
import ReactMarkdown from 'react-markdown';
import Iframe from 'react-iframe';
import { Pane } from '@cybercongress/gravity';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import CodeBlock from '../codeBlock';
import { Dots, LinkWindow } from '../../../components';
import { CYBER } from '../../../utils/config';

// const htmlParser = require('react-markdown/plugins/html-parser');

// const parseHtml = htmlParser({
//   isValidNode: (node) => node.type !== 'script',
// });

// const AsyncImage = ({ src }) => {
//   React.useEffect(() => {
//     const canvas = document.getElementById('ipfsImg');
//     const ctx = canvas.getContext('2d');

//     const image = new Image();
//     image.onload = function () {
//       ctx.drawImage(image, 0, 0);
//     };
//     image.src = src
//   }, [src]);

//   return <canvas id="ipfsImg" />;
// };

function ContentTab({ typeContent, gateway, content, cid, stylesImg }) {
  try {
    if (gateway) {
      return (
        <>
          {/* <Pane
            position="absolute"
            zIndex="2"
            top="100px"
            left="0"
            bottom="0"
            right="0"
          > */}
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
              src={`${CYBER.CYBER_GATEWAY}/ipfs/${cid}`}
              style={{
                backgroundColor: '#fff',
              }}
            />
          </div>
          {/* </Pane> */}
          {/* <Dots big /> */}
        </>
      );
    }
    if (typeContent === 'image') {
      return (
        <img
          alt="content"
          id="imgIpfs"
          style={stylesImg || { objectFit: 'contain', width: '100%' }}
          src={content}
        />
      );
    }
    if (typeContent === 'link') {
      return (
        <div
          style={{
            textAlign: 'start',
            paddingTop: '30px',
            paddingBottom: '20px',
            minHeight: '100px',
          }}
        >
          <LinkWindow to={content}>{content}</LinkWindow>

          <Iframe
            width="100%"
            height="100%"
            // loading={<Dots />}
            id="iframeCid"
            className="iframe-SearchItem"
            src={content}
            style={{
              backgroundColor: '#fff',
            }}
          />
        </div>
      );
    }
    // if (content.indexOf('<!DOCTYPE') !== -1) {
    //   return (
    //     <div
    //       style={{
    //         textAlign: 'center',
    //         backgroundColor: '#000',

    //         minHeight: 'calc(100% - 100px)',
    //       }}
    //     >
    //       <Iframe
    //         width="100%"
    //         height="100%"
    //         loading={<Dots />}
    //         id="iframeCid"
    //         className="iframe-SearchItem"
    //         src={`https://io.cybernode.ai/ipfs/${cid}`}
    //       />
    //     </div>
    //   );
    // }

    return (
      <div className="markdown">
        <ReactMarkdown
          children={content}
          rehypePlugins={[rehypeStringify, rehypeSanitize]}
          // skipHtml
          // astPlugins={[parseHtml]}
          // renderers={{ code: CodeBlock }}
          remarkPlugins={[remarkGfm]}
          // plugins={[toc]}
          // escapeHtml={false}
        />
      </div>
    );
  } catch (error) {
    return (
      <div
        style={{
          textAlign: 'center',
          backgroundColor: '#000',

          minHeight: 'calc(100% - 100px)',
        }}
      >
        <Iframe
          width="100%"
          height="100%"
          loading={<Dots />}
          id="iframeCid"
          className="iframe-SearchItem"
          src={`https://io.cybernode.ai/ipfs/${cid}`}
        />
      </div>
    );
  }
}

export default ContentTab;
