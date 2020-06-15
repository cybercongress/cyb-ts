import React from 'react';
import ReactMarkdown from 'react-markdown';
import Iframe from 'react-iframe';
import { Pane } from '@cybercongress/gravity';
import CodeBlock from '../codeBlock';
import { Dots } from '../../../components';

const htmlParser = require('react-markdown/plugins/html-parser');

const parseHtml = htmlParser({
  isValidNode: node => node.type !== 'script',
});

function ContentTab({ typeContent, gateway, content, cid, stylesImg }) {
  if (gateway) {
    return (
      <>
        <Pane
          position="absolute"
          zIndex="2"
          top="100px"
          left="0"
          bottom="0"
          right="0"
        >
          <div
            style={{
              textAlign: 'center',
              backgroundColor: '#000',
              height: '100%',
            }}
          >
            <Iframe
              width="100%"
              height="100%"
              id="iframeCid"
              className="iframe-SearchItem"
              src={`https://io.cybernode.ai/ipfs/${cid}`}
            />
          </div>
        </Pane>
        <Dots big />
      </>
    );
  }
  if (typeContent === 'image') {
    return (
      <img alt="content" style={stylesImg || { width: '100%' }} src={content} />
    );
  }
  if (typeContent === 'link') {
    return (
      <div
        style={{
          textAlign: 'center',
          backgroundColor: '#000',
          height: '100%',
        }}
      >
        <Iframe
          width="100%"
          height="100%"
          id="iframeCid"
          className="iframe-SearchItem"
          src={content}
        />
      </div>
    );
  }
  return (
    <div className="markdown">
      <ReactMarkdown
        source={content}
        escapeHtml={false}
        skipHtml={false}
        astPlugins={[parseHtml]}
        renderers={{ code: CodeBlock }}
        // plugins={[toc]}
        // escapeHtml={false}
      />
    </div>
  );
}

export default ContentTab;
