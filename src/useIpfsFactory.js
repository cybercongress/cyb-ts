import { useEffect, useState } from 'react';
import { create } from 'ipfs-core';

import DetectRTC from 'detectrtc';
import { isMobileTablet } from './utils/utils';

let ipfs = null;

const configIpfs = (init = true) => ({
  repo: 'ipfs-repo-cyber',
  init,
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
  // config: {
  //   Addresses: {
  //     Swarm: [
  //       // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
  //       '/dns4/ws-star.discovery.cybernode.ai/tcp/443/wss/p2p-webrtc-star',
  //       // '/ip4/159.89.24.179/tcp/4001/p2p/QmZBfqaL2L92rrTWR2Cdmor3R3EBLaoYzeVLEEwE3AJmWe',
  //       // '/ip6/2a03:b0c0:3:d0::4ed:8001/tcp/4001/p2p/QmZBfqaL2L92rrTWR2Cdmor3R3EBLaoYzeVLEEwE3AJmWe',
  //     ],
  //   },
  //   Bootstrap: [
  //     '/dns4/node0.preload.ipfs.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
  //     '/dns4/node1.preload.ipfs.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
  //   ],
  // },
});

const startIpfs = async () => {
  if (ipfs) {
    console.log('IPFS already started');
  } else {
    try {
      console.time('IPFS Started');
      ipfs = await create(configIpfs());
      console.timeEnd('IPFS Started');
    } catch (error) {
      ipfs = await create(configIpfs(false));
    }
  }
};

function useIpfsFactory() {
  // const [node, setNode] = useState(null);
  // const [status, setStatus] = useState(false);
  // const [id, setId] = useState(null);

  useEffect(() => {
    // The fn to useEffect should not return anything other than a cleanup fn,
    // So it cannot be marked async, which causes it to return a promise,
    // Hence we delegate to a async fn rather than making the param an async fn.
    startIpfs();

    return function cleanup() {
      if (ipfs && ipfs.stop) {
        console.log('Stopping IPFS');
        ipfs.stop().catch((err) => console.error(err));
        ipfs = null;
      }
    };
  }, []);

  return { ipfs };
}

export default useIpfsFactory;
