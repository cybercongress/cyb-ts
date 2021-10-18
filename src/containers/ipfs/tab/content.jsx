import React from 'react';
import ReactMarkdown from 'react-markdown';
import Iframe from 'react-iframe';
import { Pane } from '@cybercongress/gravity';
import CodeBlock from '../codeBlock';
import { Dots, LinkWindow } from '../../../components';

const htmlParser = require('react-markdown/plugins/html-parser');

const parseHtml = htmlParser({
  isValidNode: node => node.type !== 'script',
});

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

              minHeight: 'calc(100% - 100px)',
            }}
          >
            <Iframe
              width="100%"
              height="100%"
              // loading={<Dots />}
              id="iframeCid"
              className="iframe-SearchItem"
              src={`https://io.cybernode.ai/ipfs/${cid}`}
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
    if (content.indexOf('<!DOCTYPE') !== -1) {
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

    return (
      <div className="markdown">
        <ReactMarkdown
          source={content}
          escapeHtml
          astPlugins={[parseHtml]}
          renderers={{ code: CodeBlock }}
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
