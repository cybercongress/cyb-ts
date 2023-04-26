import { multiaddr } from '@multiformats/multiaddr';

import * as external from './external';
import * as embedded from './embedded';

let client;

const CYBERNODE_SWARM_ADDR =
  '/dns4/swarm.io.cybernode.ai/tcp/443/wss/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB';

const connectToSwarm = async (node, address) => {
  const multiaddrSwarm = multiaddr(address);
  console.log(`Connecting to swarm ${address}`);
  await node.bootstrap.add(multiaddrSwarm);

  node?.swarm
    .connect(multiaddrSwarm)
    .then((resp) => {
      console.log(`Welcome to swarm ${address} 🐝🐝🐝`);
      // node.swarm.peers().then((peers) => console.log('---peeers', peers));
    })
    .catch((err) => {
      console.log(
        'Error object properties:',
        Object.getOwnPropertyNames(err),
        err.stack,
        err.errors,
        err.message
      );
      console.log(`Can't connect to swarm ${address}: ${err.message}`);
    });
};

export async function initIpfsClient(opts) {
  let backend;

  switch (opts.ipfsNodeType) {
    case 'embedded':
      backend = embedded;
      break;
    case 'external':
      backend = external;
      break;

    default:
      throw new Error(`Unsupported ipfsNodeType: ${opts.ipfsNodeType}`);
  }

  const instance = await backend.init(opts);
  window.ipfs = instance;

  // Only for embedded node
  if (instance.libp2p) {
    // instance.libp2p.addEventListener('peer:discovery', (evt) => {
    //   // window.discoveredPeers.set(evt.detail.id.toString(), evt.detail)
    //   // console.log(`Discovered peer ${evt.detail.id.toString()}`);
    // });
    instance.libp2p.addEventListener('peer:connect', (evt) => {
      console.log(`Connected to ${evt.detail.remotePeer.toString()}`);
    });
    instance.libp2p.addEventListener('peer:disconnect', (evt) => {
      console.log(`Disconnected from ${evt.detail.remotePeer.toString()}`);
    });

    // connectToSwarm(
    //   instance,
    //   '/dns4/ws-star.discovery.cybernode.ai/tcp/443/wss/p2p-webrtc-star'
    // );
  }

  connectToSwarm(instance, CYBERNODE_SWARM_ADDR);

  client = backend;
  return instance;
}

export async function destroyIpfsClient() {
  if (!client) {
    return;
  }

  try {
    await client.destroy();
  } finally {
    client = null;
  }
}
