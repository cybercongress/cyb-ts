/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-unused-modules */
import { webSockets } from '@libp2p/websockets';
import * as filters from '@libp2p/websockets/filters';
// import { circuitRelayTransport } from 'libp2p/circuit-relay';
// import { kadDHT } from '@libp2p/kad-dht';
import { mplex } from '@libp2p/mplex';
import { noise } from '@chainsafe/libp2p-noise';
import { createLibp2p } from 'libp2p';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { webRTCDirect } from '@libp2p/webrtc-direct';
import { bootstrap } from '@libp2p/bootstrap';
// import { webRTC } from "js-libp2p-webrtc";
import { webRTC } from '@libp2p/webrtc';

import { delegatedPeerRouting } from '@libp2p/delegated-peer-routing';

import { delegatedContentRouting } from '@libp2p/delegated-content-routing';
import { create as createIpfsHttpClient } from 'ipfs-http-client';
import { create as kuboClient } from 'kubo-rpc-client';

// default is to use ipfs.io
const peerClient = kuboClient({
  // use default api settings
  protocol: 'https',
  port: 443,
  host: 'node0.delegate.ipfs.io',
});

// default is to use ipfs.io
const contentClient = createIpfsHttpClient({
  // use default api settings
  protocol: 'https',
  port: 443,
  host: 'node0.delegate.ipfs.io',
});

// export const nodeLibp2pFactory = async (peerId) =>
//   await createLibp2p({
//     peerId,
//     transports: [
//       webSockets({
//         filter: filters.all,
//       }),
//       webRTC({}),
//       circuitRelayTransport({
//         discoverRelays: 1,
//       }),
//     ],
//     connectionEncryption: [noise()],
//     streamMuxers: [mplex()],
//   });

export const createNodeLibp2p = (opts) => {
  const peerId = opts?.peerId;
  return createLibp2p({
    peerId,
    pubsub: gossipsub({
      canRelayMessage: true,
      allowPublishToZeroPeers: true,
    }),
    addresses: {
      listen: [
        // "/dns4/ws-star.discovery.cybernode.ai/tcp/443/wss/p2p-webrtc-star",
        // "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
        // "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
      ],
    },
    // dht: kadDHT(),
    // transports: [webRTC.transport, ws, webRTCDirect(), webTransport()],
    transports: [
      webSockets({ filters: filters.all }),
      // wrtcStar.transport,
      // webRTC({}),
      // webRTCDirect(),
      // circuitRelayTransport({ discoverRelays: 2 }),
    ],
    streamMuxers: [mplex()],
    peerDiscovery: [
      // wrtcStar.discovery,
      // bootstrap({
      //   list: [
      //     "/dns4/ws-star.discovery.cybernode.ai/tcp/443/wss/p2p-webrtc-star",
      //   ],
      // }),
    ],
    peerRouters: [delegatedPeerRouting(peerClient)],
    contentRouters: [delegatedContentRouting(contentClient)],
    connectionEncryption: [noise()],
    nat: {
      enabled: true,
    },
  });
};
