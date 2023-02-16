import { useEffect, useState } from 'react';
import { isMobileTablet } from './utils/utils';
import configIpfs from './utils/configIpfs';

import { create } from 'ipfs-core';

const DetectRTC = require('detectrtc');

const initIpfsNode = async () => {
  let nodeIpfs = null;
  let ipfsStatus = false;
  let id = null;
  try {
    const node = await create(configIpfs(true));
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
    const node = await create(configIpfs(false));
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
      tryConnectToPeer(data.nodeIpfs);
    };
    init();
  }, []);

  const tryConnectToPeer = async (nodeIpfs) => {
    try {
      if (nodeIpfs !== null) {
        const peerSwarm =
          '/dns4/ws-star.discovery.cybernode.ai/tcp/4430/wss/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB';
        const peerBootstrap =
          '/dns4/ws-star.discovery.cybernode.ai/tcp/4430/wss/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB';
        await nodeIpfs.bootstrap.add(peerBootstrap);
        nodeIpfs.libp2p
          .ping(peerSwarm)
          .then((latency) => {
            console.log(`latency`, latency);
            nodeIpfs.swarm.connect(peerSwarm, 1 * 1000).then(() => {
              console.log(`🪐 Connected to ${peerSwarm}`);
            });
          })
          .catch(() => {
            console.log(`🪓 Could not connect to ${peerSwarm}`);
          })
          .then(() => {
            nodeIpfs.swarm.peers().then((item) => {
              console.log('peerInfos', item);
            });
          });
        // const peerInfos = await nodeIpfs.swarm.peers();
        // console.log('peerInfos', peerInfos);
        // setLoader(dataIpfsStart.loader);
      }
    } catch (error) {
      console.log(`error`, error);
    }
  };

  return {
    node,
    loader,
    status,
    mobile,
    id,
  };
};

export default useIpfsStart;
