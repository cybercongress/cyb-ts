import { useEffect, useState } from 'react';
import { isMobileTablet } from './utils/utils';

const IPFS = require('ipfs');
const DetectRTC = require('detectrtc');

const initIpfsNode = async () => {
  let nodeIpfs = null;
  let ipfsStatus = false;
  let id = null;
  try {
    const node = await IPFS.create({
      repo: 'ipfs-repo-cyber',
      init: true,
      start: true,
      relay: {
        enabled: true,
        hop: {
          enabled: true,
        },
      },
      EXPERIMENTAL: {
        pubsub: true,
      },
      config: {
        Addresses: {
          Swarm: [
            // '/dns4/star.thedisco.zone/tcp/9090/wss/p2p-webrtc-star',
            // '/dns6/star.thedisco.zone/tcp/9090/wss/p2p-webrtc-star',
            '/dns4/ws-star.discovery.cybernode.ai/tcp/443/wss/p2p-webrtc-star',
          ],
        },
        // Bootstrap: [
        //   '/dns6/ipfs.thedisco.zone/tcp/4430/wss/p2p/12D3KooWChhhfGdB9GJy1GbhghAAKCUR99oCymMEVS4eUcEy67nt',
        //   '/dns4/ipfs.thedisco.zone/tcp/4430/wss/p2p/12D3KooWChhhfGdB9GJy1GbhghAAKCUR99oCymMEVS4eUcEy67nt',
        // ],
      },
    });
    console.log('node init false', node);
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
    const node = await IPFS.create({
      repo: 'ipfs-repo-cyber',
      init: false,
      start: true,
      relay: {
        enabled: true,
        hop: {
          enabled: true,
        },
      },
      EXPERIMENTAL: {
        pubsub: true,
      },
      config: {
        Addresses: {
          Swarm: [
            // '/dns4/star.thedisco.zone/tcp/9090/wss/p2p-webrtc-star',
            // '/dns6/star.thedisco.zone/tcp/9090/wss/p2p-webrtc-star',
            '/dns4/ws-star.discovery.cybernode.ai/tcp/443/wss/p2p-webrtc-star',
            // '/ip6/64:ff9b::5863:6992/udp/4001/quic/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB',
          ],
        },
        Bootstrap: [
          // '/ip6/64:ff9b::5863:6992/udp/4001/quic/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB'
          // '/dns4/node0.preload.ipfs.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
          // '/dns4/node1.preload.ipfs.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
        ],
      },
    });
    console.log('node init true', node);
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
