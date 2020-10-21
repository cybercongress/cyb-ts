import { useEffect, useState } from 'react';
import { isMobileTablet } from './utils/utils';

const IPFS = require('ipfs');
const DetectRTC = require('detectrtc');

const initIpfsNode = async () => {
  let nodeIpfs = null;
  let ipfsStatus = false;
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
      config: {
        Addresses: {
          Swarm: [
            // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
            // '/dns4/ws-star.discovery.cybernode.ai/tcp/443/wss/p2p-webrtc-star',
          ],
        },
        Bootstrap: [
          '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
          '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
          '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
          '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
          '/dns4/node0.preload.ipfs.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
          '/dns4/node1.preload.ipfs.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
        ],
      },
    });
    console.log('node init false', node);
    nodeIpfs = node;
    if (nodeIpfs !== null) {
      const status = await node.isOnline();
      ipfsStatus = status;
    }
    return {
      nodeIpfs,
      ipfsStatus,
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
      config: {
        Addresses: {
          Swarm: [
            // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
            // '/dns4/ws-star.discovery.cybernode.ai/tcp/443/wss/p2p-webrtc-star',
          ],
        },
        Bootstrap: [
          '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
          '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
          '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
          '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
          '/dns4/node0.preload.ipfs.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
          '/dns4/node1.preload.ipfs.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
        ],
      },
    });
    console.log('node init true', node);
    nodeIpfs = node;
    if (node !== null) {
      const status = await node.isOnline();
      ipfsStatus = status;
    }
    return {
      nodeIpfs,
      ipfsStatus,
    };
  }
};

const useIpfsStart = () => {
  const [node, setNode] = useState(null);
  const [loader, setLoader] = useState(true);
  const [status, setStatus] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const init = async () => {
      const isMobile = isMobileTablet();
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      setMobile(isMobile);
      //     setLoader(false);
      // //     console.log('DetectRTC.isWebRTCSupported', DetectRTC.isWebRTCSupported);
      if (!isMobile) {
        if (DetectRTC.isWebRTCSupported && !isSafari) {
          const data = await initIpfsNode();
          setNode(data.nodeIpfs);
          setStatus(data.ipfsStatus);
          setLoader(false);
        } else {
          setLoader(false);
        }
      } else {
        setLoader(false);
      }
    };
    init();
  }, []);

  return {
    node,
    loader,
    status,
    mobile,
  };
};

export default useIpfsStart;
