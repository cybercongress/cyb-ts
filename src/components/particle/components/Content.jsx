import React, { useEffect, useState } from 'react';
import Iframe from 'react-iframe';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import ReactMarkdown from 'react-markdown';
import { ContainerGradientText } from '../../containerGradient/ContainerGradient';
import { CYBER } from '../../../utils/config';

const checkIpfsState = () => {
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

function Content({ typeContent, gateway, content, textPreview, cid }) {
  const [gatewayUrl, setGatewayUrl] = useState(null);

  useEffect(() => {
    // if (nodeIpfs && nodeIpfs !== null) {
    const response = checkIpfsState();
    setGatewayUrl(response);
    // }
  }, [cid]);

  let contentItem;

  if (typeContent === 'text') {
    contentItem = (
      <div className="container-text-SearchItem">
        <ReactMarkdown
          children={textPreview}
          rehypePlugins={[rehypeSanitize]}
          remarkPlugins={[remarkGfm]}
        />
      </div>
    );
  } else if (typeContent === 'image') {
    contentItem = (
      <img style={{ width: '100%', paddingTop: 10 }} alt="img" src={content} />
    );
  } else if (typeContent === 'application/pdf') {
    contentItem = (
      <Iframe
        width="100%"
        height="400px"
        className="iframe-SearchItem"
        url={content}
      />
    );
  } else {
    contentItem = (
      <Iframe
        width="100%"
        height="400px"
        className="iframe-SearchItem"
        url={`${gatewayUrl}/ipfs/${cid}`}
      />
    );
  }

  return (
    <ContainerGradientText status="green">{contentItem}</ContainerGradientText>
  );
}

export default Content;
