// TODO: refactor this component, + add styles
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Iframe from 'react-iframe';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { useIpfs } from 'src/contexts/ipfs';

import { IPFSContent, IPFSContentDetails } from 'src/utils/ipfs/ipfs';
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

function ReactMarkdownContainer({ children }: { children: string }) {
  return (
    <div className="markdown">
      <ReactMarkdown
        // eslint-disable-next-line react/no-children-prop

        rehypePlugins={[rehypeStringify, rehypeSanitize]}
        // skipHtml
        // astPlugins={[parseHtml]}
        remarkPlugins={[remarkGfm]}
        // plugins={[toc]}
        // escapeHtml={false}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

const getIpfsUserGatewanAndNodeType = () => {
  const LS_IPFS_STATE = localStorage.getItem('ipfsState');

  if (LS_IPFS_STATE !== null) {
    const lsTypeIpfsData = JSON.parse(LS_IPFS_STATE);
    if (Object.prototype.hasOwnProperty.call(lsTypeIpfsData, 'userGateway')) {
      const { userGateway, ipfsNodeType } = lsTypeIpfsData;
      if (ipfsNodeType === 'external') {
        return userGateway;
      }
    }
  }

  return CYBER.CYBER_GATEWAY;
};

type ContentTabProps = {
  contentDetails: IPFSContentDetails;
};

function ContentTab({ contentDetails }: ContentTabProps): JSX.Element {
  const { node: nodeIpfs } = useIpfs();
  const { cid } = contentDetails;
  const [gatewayUrl, setGatewayUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!nodeIpfs) {
      const response = getIpfsUserGatewanAndNodeType();
      setGatewayUrl(response);
    } else {
      setGatewayUrl(CYBER.CYBER_GATEWAY);
    }
  }, [nodeIpfs]);

  try {
    if (!gatewayUrl) {
      return <div>...</div>;
    }

    if (contentDetails?.gateway) {
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
              src={`${gatewayUrl}/ipfs/${cid}`}
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
    if (contentDetails?.type === 'image') {
      return (
        <img
          alt="content"
          id="imgIpfs"
          style={{ objectFit: 'contain', width: '100%' }}
          src={contentDetails?.content}
        />
      );
    }
    if (contentDetails?.type === 'text') {
      return (
        <ReactMarkdownContainer>
          {contentDetails?.content || cid.toString()}
        </ReactMarkdownContainer>
      );
    }

    if (contentDetails?.type === 'link') {
      return (
        <div
          style={{
            textAlign: 'start',
            paddingTop: '30px',
            paddingBottom: '20px',
            minHeight: '100px',
          }}
        >
          <LinkWindow to={contentDetails?.link}>
            {contentDetails?.content}
          </LinkWindow>

          <Iframe
            width="100%"
            height="100%"
            // loading={<Dots />}
            id="iframeCid"
            className="iframe-SearchItem"
            url={contentDetails?.content}
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
      <ReactMarkdownContainer>
        {contentDetails?.content || cid.toString()}
      </ReactMarkdownContainer>
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
          src={`${gatewayUrl}/ipfs/${cid}`}
        />
      </div>
    );
  }
}

export default ContentTab;
