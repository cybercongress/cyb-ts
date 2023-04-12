import { create } from 'ipfs-core';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { webSockets } from '@libp2p/websockets';
import { all, dnsWsOrWss } from '@libp2p/websockets/filters';

import { multiaddr } from '@multiformats/multiaddr';
import { webRTCStar } from '@libp2p/webrtc-star';
// import { MulticastDNS } from '@libp2p/mdns';
// import { Bootstrap } from '@libp2p/bootstrap';
import { kadDHT } from '@libp2p/kad-dht';
import { mplex } from '@libp2p/mplex';
import { noise } from '@chainsafe/libp2p-noise';
import { createLibp2p } from 'libp2p';

const rendezvous =
  '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star';
// '/dns4/ws-star.discovery.cybernode.ai/tcp/443/wss/p2p-webrtc-star';

const ws = webSockets({
  filter: all,
  // websocket: {
  //   protocol: 'wss',
  // },
});

const nodeLibp2p = async (opts) => {
  const webRTC = webRTCStar();
  const peerId = opts.peerId;

  return createLibp2p({
    peerId,
    addresses: {
      listen: [
        '/dns4/ws-star.discovery.cybernode.ai/tcp/443/wss/p2p-webrtc-star',
        '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
        '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
      ],
    },
    dht: kadDHT(),
    transports: [webRTC.transport, ws],
    streamMuxers: [mplex()],
    peerDiscovery: [webRTC.discovery],
    connectionEncryption: [noise()],
  });
};

async function main() {
  const repoPath1 = await fs.mkdtemp(path.join(os.tmpdir(), 'ipfs-'));
  const repoPath2 = await fs.mkdtemp(path.join(os.tmpdir(), 'ipfs-'));
  const params = {
    libp2p: nodeLibp2p,
    relay: {
      enabled: true,
      hop: {
        enabled: true,
      },
    },
    Addresses: {
      Discovery: {
        MDNS: {
          Enabled: true,
          Interval: 10,
        },
        webRTCStar: {
          Enabled: true,
        },
      },
    },
  };
  const node1 = await create({ repo: repoPath1, ...params });
  const node2 = await create({ repo: repoPath2, ...params });

  // Connect node1 to the rendezvous node
  await node1.swarm.connect(rendezvous);

  // Wait for node1 to connect to other peers
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Connect node2 to the rendezvous node
  await node2.swarm.connect(rendezvous);

  // Wait for node2 to connect to other peers
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Verify that node1 and node2 are connected to each other
  const peers = await node1.swarm.peers();
  console.log(peers);
}

main();
