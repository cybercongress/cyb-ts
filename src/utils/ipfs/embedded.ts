import { create, Options } from 'ipfs-core';
import { PrivateKey } from 'libp2p-crypto';
import { KeychainConfig, DEK } from 'ipfs-core-types/src/config';
import { webSockets } from '@libp2p/websockets';
import { all, dnsWsOrWss } from '@libp2p/websockets/filters';
import { IPFS, PeerId } from 'kubo-rpc-client/types';
import { multiaddr } from '@multiformats/multiaddr';
import { webRTCStar } from '@libp2p/webrtc-star';
// import { MulticastDNS } from '@libp2p/mdns';
// import { Bootstrap } from '@libp2p/bootstrap';
import { kadDHT } from '@libp2p/kad-dht';
import { mplex } from '@libp2p/mplex';
import { noise } from '@chainsafe/libp2p-noise';
import { createLibp2p } from 'libp2p';
//... other stuff
const ws = webSockets({
  filter: dnsWsOrWss,
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

import configIpfs from './configIpfs';

let node: null | IPFS = null;
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
          console.log(`🪓 Could not connect to!! ${peerSwarm}`);
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
const tryConnectToSwarm = async (nodeIpfs, address) => {
  try {
    // await deleteStore(path);

    console.time('IPFS Started');
    console.log('Try connect [000] --');
    await nodeIpfs.bootstrap.add(multiaddr(address));
    node?.swarm
      .connect(multiaddr(address))
      .then((resp) => {
        console.log(`[000]Connected swarm ${address}`);
      })
      .catch((err) => {
        console.log(`[000]err connect to swatm ${address}`, Object.keys(err));
        console.log(
          'Error object properties:',
          Object.getOwnPropertyNames(err),
          err.stack,
          err.errors,
          err.message
        );

        // for (const error of err.errors) {
        //   console.error('Failed to connect to peer:', error);
        // }
      });

    //         '/ip4/88.99.105.146/tcp/9096/p2p/12D3KooWGJvMBPGSQtLeXJgL11wmK67Tp2v69A1Q4rp5FjoSGBNd',
    // '/ip4/135.181.19.86/tcp/9096/p2p/12D3KooWRkf2iZHfy1mUrdReHBFXu8TWWzK1XzsMy8TXqVohwEtH',
    // await tryConnectToPeer(node);
    console.timeEnd('IPFS Started');
  } catch (error) {
    console.error('IPFS init error:', error);
    node = null;
    throw new Error(`init embedded type ${error}`);
  }
};

const customConfig: Options = {
  repo: `ok${Math.random()}`,
  EXPERIMENTAL: {
    ipnsPubsub: true,
  },
  relay: {
    enabled: true,
    hop: {
      enabled: true,
    },
  },
  config: {
    Pubsub: {
      Enabled: true,
    },
    Bootstrap: [
      '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
      '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
      '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
      '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
    ],
    Addresses: {
      Swarm: [
        // '/ip4/127.0.0.1/tcp/9090/wss',
        `/ip4/0.0.0.0/tcp/0`,
        `/ip4/127.0.0.1/tcp/0/ws`,
        '/ip4/0.0.0.0/tcp/9090/ws/p2p-webrtc-star',
        '/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star',
        '/dns4/ws-star.discovery.cybernode.ai/tcp/443/wss/p2p-webrtc-star',
        // '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
        // '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
        // '/ip4/88.99.105.146/tcp/4011/ws/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB',
        // '/ip4/135.181.19.86/tcp/9094/p2p/12D3KooWRkf2iZHfy1mUrdReHBFXu8TWWzK1XzsMy8TXqVohwEtH',
      ],
    },
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
  libp2p: nodeLibp2p,
  // libp2p: {
  //   transports: [ws],
  // },
};

export async function init() {
  if (node !== null) {
    console.log('IPFS already started');
  } else if (window.ipfs && window.ipfs.enable) {
    console.log('Found window.ipfs');
    node = await window.ipfs.enable({ commands: ['id'] });
  } else {
    try {
      // await deleteStore(path);
      console.time('IPFS Started');
      node = await create(configIpfs());
      // node = await create(customConfig);
      window.node = node;
      node.libp2p.addEventListener('peer:discovery', (evt) => {
        // window.discoveredPeers.set(evt.detail.id.toString(), evt.detail)
        // console.log(`Discovered peer ${evt.detail.id.toString()}`);
      });

      node.libp2p.addEventListener('peer:connect', (evt) => {
        console.log(`Connected to ${evt.detail.remotePeer.toString()}`);
      });
      node.libp2p.addEventListener('peer:disconnect', (evt) => {
        console.log(`Disconnected from ${evt.detail.remotePeer.toString()}`);
      });

      // (node as IPFS).libp2p.on('peer:connect', (peerInfo) => {
      //   console.log(`Connected to peer ${peerInfo.id.toB58String()}`);
      // });

      // // Log disconnected peers
      // node.libp2p.on('peer:disconnect', (peerInfo) => {
      //   console.log(`Disconnected from peer ${peerInfo.id.toB58String()}`);
      // });
      console.log('Try connect [000]', node);
      // await tryConnectToSwarm(
      //   node,
      //   '/ip4/127.0.0.1/tcp/4004/ws/p2p/12D3KooWFr1j1SyVgLnTx9AgS8dkKExvUpq75JCuC3ndonoFpckz'
      // );
      const { id } = await node.id();
      console.log(id.toString());
      await tryConnectToSwarm(
        node,
        // '/ip4/88.99.105.146/tcp/433/wss/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB'
        `/dnsaddr/io.cybernode.ai/tcp/4011/ws/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB`
      );
      await tryConnectToSwarm(
        node,
        // '/dnsaddr/swarm.io.cybernode.ai/tcp/433/wss/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB'
        '/ip6/2a01:4f8:10a:19d1::2/tcp/4011/ws/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB'
        // `/ip4/172.20.10.2/tcp/4004/ws/p2p/12D3KooWFr1j1SyVgLnTx9AgS8dkKExvUpq75JCuC3ndonoFpckz`
      );
      await tryConnectToSwarm(
        node,
        // '/ip4/88.99.105.146/tcp/4011/ws/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB'
        '/dns4/swarm.io.cybernode.ai/tcp/433/wss/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB'
        // '/dnsaddr/swarm.io.cybernode.ai/tcp/433/wss/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB'
        // `/ip4/88.99.105.146/tcp/4011/ws/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB`
      );
      await tryConnectToSwarm(
        node,
        '/ip4/88.99.105.146/tcp/4011/wss/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB'
        // '/dnsaddr/swarm.io.cybernode.ai/tcp/433/wss/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB'
        // `/ip4/88.99.105.146/tcp/4011/ws/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB`
      );
      //
      // await tryConnectToSwarm(
      //   node,
      //   '/dns4/ws-star.discovery.cybernode.ai/tcp/443/wss/p2p-webrtc-star/'
      // );
      // await tryConnectToSwarm(
      //   node,
      //   '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/'
      // );
      // await tryConnectToSwarm(
      //   node,
      //   '/ip4/127.0.0.1/tcp/4004/ws/p2p/12D3KooWFr1j1SyVgLnTx9AgS8dkKExvUpq75JCuC3ndonoFpckz'
      //   // '/ip4/127.0.0.1/tcp/13579/ws/p2p-webrtc-star/'
      //   // '/ip4/127.0.0.1/tcp/4001/p2p/12D3KooWCf2wv8ptCVVyhfPU3kpSo3Ly2dFt1cFVW7grjoDPTDQe'
      // );
      //cluster
      // /ip4/127.0.0.1/tcp/4001/p2p/12D3KooWFr1j1SyVgLnTx9AgS8dkKExvUpq75JCuC3ndonoFpckz

      //         '/ip4/88.99.105.146/tcp/9096/p2p/12D3KooWGJvMBPGSQtLeXJgL11wmK67Tp2v69A1Q4rp5FjoSGBNd',
      // '/ip4/135.181.19.86/tcp/9096/p2p/12D3KooWRkf2iZHfy1mUrdReHBFXu8TWWzK1XzsMy8TXqVohwEtH',
      // await tryConnectToPeer(node);
      console.timeEnd('IPFS Started');
    } catch (error) {
      console.error('IPFS init error:', error);
      node = null;
      throw new Error(`init embedded type ${error}`);
    }
  }

  return node;
}

export async function destroy() {
  console.log('destroy');
  if (!node) {
    return;
  }

  console.log('node', node);
  await node.stop();
  node = null;
}
