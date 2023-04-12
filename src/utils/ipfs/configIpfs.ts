// eslint-disable-next-line import/no-unresolved
import { webSockets } from '@libp2p/websockets';
import * as filters from '@libp2p/websockets/filters';

const configIpfs = () => ({
  start: true,
  // repo: 'ipfs-repo-cyber-v2',
  repo: `ok${Math.random()}`,

  config: {
    API: {
      HTTPHeaders: {
        'Access-Control-Allow-Methods': ['PUT', 'POST'],
        'Access-Control-Allow-Origin': ['*'],
      },
    },
    Addresses: {
      Gateway: '/ip4/127.0.0.1/tcp/8080',
      Swarm: [
        '/dns4/ws-star.discovery.cybernode.ai/tcp/443/wss/p2p-webrtc-star',
        '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
        '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
        '/ip4/88.99.105.146/tcp/9094/p2p/12D3KooWGJvMBPGSQtLeXJgL11wmK67Tp2v69A1Q4rp5FjoSGBNd',
        '/ip4/135.181.19.86/tcp/9094/p2p/12D3KooWRkf2iZHfy1mUrdReHBFXu8TWWzK1XzsMy8TXqVohwEtH',
      ],
      Delegates: [
        '/dns4/node0.delegate.ipfs.io/tcp/443/https',
        '/dns4/node1.delegate.ipfs.io/tcp/443/https',
        '/dns4/node2.delegate.ipfs.io/tcp/443/https',
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
    Peering: {
      Peers: [],
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
      AddrFilters: null,
      ConnMgr: {
        GracePeriod: '300s',
        HighWater: 300,
        LowWater: 50,
        Type: 'basic',
      },
      DisableBandwidthMetrics: false,
      DisableNatPortMap: false,
      EnableAutoRelay: true,
      EnableRelayHop: true,
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
        filter: filters.all,
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
