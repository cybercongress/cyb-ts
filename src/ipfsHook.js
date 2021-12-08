import { useEffect, useState } from 'react';
import { isMobileTablet } from './utils/utils';
import configIpfs from './utils/configIpfs';

const IPFS = require('ipfs');
const DetectRTC = require('detectrtc');

const initIpfsNode = async () => {
  let nodeIpfs = null;
  let ipfsStatus = false;
  let id = null;
  try {
    const node = await IPFS.create(configIpfs(true));
    console.log('node init true', node);
    nodeIpfs = node;
    if (nodeIpfs !== null) {
      const status = await node.isOnline();
      ipfsStatus = status;
      const responseId = await node.id();
      id = responseId;
      console.log(`responseId`, responseId);
    }
    return {
      nodeIpfs,
      ipfsStatus,
      id,
    };
  } catch (error) {
    console.log(error);
    const node = await IPFS.create(configIpfs(false));
    console.log('node init false', node);
    nodeIpfs = node;
    if (node !== null) {
      const status = await node.isOnline();
      ipfsStatus = status;
      const responseId = await node.id();
      id = responseId;
    }
    return {
      nodeIpfs,
      ipfsStatus,
      id,
    };
  }
};

const useIpfsStart = () => {
  const [node, setNode] = useState(null);
  const [loader, setLoader] = useState(true);
  const [status, setStatus] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [id, setId] = useState(null);

  useEffect(() => {
    const init = async () => {
      const isMobile = isMobileTablet();
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      setMobile(isMobile);
      //     setLoader(false);
      // //     console.log('DetectRTC.isWebRTCSupported', DetectRTC.isWebRTCSupported);
      // if (!isMobile) {
      //   if (DetectRTC.isWebRTCSupported && !isSafari) {
      const data = await initIpfsNode();
      setNode(data.nodeIpfs);
      setStatus(data.ipfsStatus);
      setLoader(false);
      setId(data.id);
      //   } else {
      //     setLoader(false);
      //   }
      // } else {
      //   setLoader(false);
      // }
    };
    init();
  }, []);

  return {
    node,
    loader,
    status,
    mobile,
    id,
  };
};

export default useIpfsStart;
