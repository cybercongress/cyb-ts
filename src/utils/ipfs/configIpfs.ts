// eslint-disable-next-line import/no-unresolved
import { webSockets } from '@libp2p/websockets';
import * as filters from '@libp2p/websockets/filters';
import { Options } from 'ipfs-core/dist/src/types';
// import { createNodeLibp2p } from './libp2pFactory';

const configIpfs = (): Options => ({
  start: true,
  repo: 'ipfs-repo-cyber-v2',
  // repo: `ok${Math.random()}`, // TODO: refactor! every launch new repo created
  relay: {
    enabled: true,
    hop: {
      enabled: true,
    },
  },
  config: {
    API: {
      HTTPHeaders: {
        'Access-Control-Allow-Methods': ['PUT', 'POST'],
        'Access-Control-Allow-Origin': [
          'http://localhost:3000',
          'http://127.0.0.1:5001',
          'http://127.0.0.1:8888',
          'http://localhost:8888',
        ],
      },
    },
    Addresses: {
      Gateway: '/ip4/127.0.0.1/tcp/8080',
      Swarm: [
        '/dns4/ws-star.discovery.cybernode.ai/tcp/443/wss/p2p-webrtc-star',
        // '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
        // '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
      ],
      Delegates: [
        // '/dns4/node0.delegate.ipfs.io/tcp/443/https',
        // '/dns4/node1.delegate.ipfs.io/tcp/443/https',
        // '/dns4/node2.delegate.ipfs.io/tcp/443/https',
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
    Bootstrap: [
      // '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
      // '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
      // '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
      // '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
      // '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
      '/dns4/ws-star.discovery.cybernode.ai/tcp/4430/wss/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB',
    ],
    Pubsub: {
      Enabled: true,
    },
    Swarm: {
      ConnMgr: {
        HighWater: 300,
        LowWater: 50,
      },
      DisableNatPortMap: false,
    },
    Routing: {
      Type: 'dhtclient',
    },
  },
  libp2p: {
    transports: [
      // This is added for local demo!
      // In a production environment the default filter should be used
      // where only DNS + WSS addresses will be dialed by websockets in the browser.
      webSockets({
        filter: filters.dnsWss,
      }),
    ],
    nat: {
      enabled: true,
    },
  },
  EXPERIMENTAL: {
    ipnsPubsub: true,
  },
});

export default configIpfs;
