import { BehaviorSubject } from 'rxjs';

import { createLibp2p, Libp2p } from 'libp2p';
import { bootstrap } from '@libp2p/bootstrap';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { dcutr } from '@libp2p/dcutr';
import { identify } from '@libp2p/identify';
import { webRTC } from '@libp2p/webrtc';
import { webSockets } from '@libp2p/websockets';
import { kadDHT } from '@libp2p/kad-dht';

import * as filters from '@libp2p/websockets/filters';
import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
import { IpfsOptsType, JsonPeerId } from 'src/services/ipfs/types';
import {
  CYBERNODE_PUBSUB_NODE,
  CYBERNODE_SWARM_ADDR_WSS,
} from 'src/services/ipfs/config';
import { multiaddr, protocols } from '@multiformats/multiaddr';
import { Option } from 'src/types';
import { jsonToPeerId } from 'src/services/ipfs/utils/peerId';
import { fromString, toString } from 'uint8arrays';
import { stringToCid } from 'src/services/ipfs/utils/cid';
// import { IDBDatastore } from 'datastore-idb';
// import { MemoryDatastore } from 'datastore-core/dist/src';
// import debug from 'debug';

// debug.enable('libp2p:*');

const bootstrapListDefault = [
  // '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
  // '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
  // '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
  // '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
  CYBERNODE_SWARM_ADDR_WSS,
  CYBERNODE_PUBSUB_NODE,
];

// const domainName = 'acidpictures.ink'; // Set this to your relayer or your node's domain

// const addAnnounceAddresses = (libp2p: Libp2p) => {
//   const addressesToAnnounce = [
//     '/webrtc',
//     `/dns4/${domainName}/tcp/4444/wss/p2p-circuit`,
//   ];

//   addressesToAnnounce.forEach((address) => {
//     const ma = multiaddr(address);
//     const multiaddrs = libp2p.getMultiaddrs();
//     if (multiaddrs.some((maddr) => maddr.equals(ma))) {
//       libp2p.multiaddrs.push(ma);
//     }
//   });

//   console.log(
//     'Announce addresses:',
//     libp2p.getMultiaddrs().map((ma) => ma.toString())
//   );
// };

const libp2pFactory = async (
  jsonPeerId: JsonPeerId,
  bootstrapList: string[]
) => {
  // const datastore = new IDBDatastore('helia-ds');
  // await datastore.open();
  // const datastore = new MemoryDatastore();
  const peerId = await jsonToPeerId(jsonPeerId);
  const libp2p = await createLibp2p({
    peerId,
    // datastore,
    addresses: {
      listen: [
        // create listeners for incoming WebRTC connection attempts on on all
        // available Circuit Relay connections
        '/webrtc',
      ],
    },
    transports: [
      // the WebSocket transport lets us dial a local relay
      webSockets({
        // this allows non-secure WebSocket connections for purposes of the demo
        filter: filters.all,
      }),
      // support dialing/listening on WebRTC addresses
      webRTC(),
      // support dialing/listening on Circuit Relay addresses
      circuitRelayTransport({
        // make a reservation on any discovered relays - this will let other
        // peers use the relay to contact us
        discoverRelays: 1,
      }),
    ],
    // a connection encrypter is necessary to dial the relay
    connectionEncryption: [noise()],
    // a stream muxer is necessary to dial the relay
    streamMuxers: [yamux()],
    connectionGater: {
      denyDialMultiaddr: () => {
        // by default we refuse to dial local addresses from browsers since they
        // are usually sent by remote peers broadcasting undialable multiaddrs and
        // cause errors to appear in the console but in this example we are
        // explicitly connecting to a local node so allow all addresses
        return false;
      },
    },
    services: {
      identify: identify(),
      pubsub: gossipsub(),
      dcutr: dcutr(),
      dht: kadDHT({}),
    },
    connectionManager: {
      minConnections: 0, // Adjusted minConnections
      // maxConnections: 100, // Adjusted maxConnections
    },
    peerDiscovery: [
      bootstrap({
        list: bootstrapList,
      }),
    ],
  });

  return libp2p;
};

// eslint-disable-next-line import/prefer-default-export, import/no-unused-modules
export const createP2PApi = (broadcastApi: BroadcastChannelSender) => {
  const libp2pInstance$ = new BehaviorSubject<Option<Libp2p>>(undefined);
  let node: Option<Libp2p>;

  function syncPeerList() {
    if (node) {
      const peers = node.getPeers().flatMap((peerId) => {
        return (
          node
            ?.getConnections(peerId)
            .map((conn) => conn.remoteAddr.toString()) || []
        );
      });
      // console.log('----syncPeerList', peers);
      broadcastApi.postP2PStatus({ peers });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const start = async (options: IpfsOptsType) => {
    try {
      if (node) {
        setTimeout(() => broadcastApi.postServiceStatus('p2p', 'started'), 0);
        return Promise.resolve(node);
      }
      broadcastApi.postServiceStatus('p2p', 'starting');
      console.time('🔋 p2p initialized');

      node = await libp2pFactory(options.peerId, [
        ...bootstrapListDefault,
        CYBERNODE_SWARM_ADDR_WSS,
      ]);

      node.addEventListener('self:peer:update', (e) => {
        const multiaddrs = node!.getMultiaddrs().map((ma) => ma.toString());
        // console.log('---peer:update', e, multiaddrs, node!.getMultiaddrs());
        broadcastApi.postP2PStatus({ addresses: multiaddrs });
      });

      node.addEventListener('connection:open', () => {
        syncPeerList();
      });
      node.addEventListener('connection:close', () => {
        syncPeerList();
      });

      node!.services.pubsub.addEventListener('message', (event) => {
        const { topic } = event.detail;
        const message = toString(event.detail.data);
        broadcastApi.postP2PMessage(topic, message);

        console.log(`[in] ${topic}: ${message}`);
      });

      setTimeout(async () => {
        console.timeEnd('🔋 p2p initialized');

        connectPeer(CYBERNODE_PUBSUB_NODE)
          .then(() => subscribeChannel('cyber'))
          .catch(console.error);

        // node!.services!.pubsub.on('cyber', (message) => {
        //   console.log(`Received message: ${message}`);
        // });

        const multiaddrs = node!.getMultiaddrs().map((ma) => ma.toString());
        broadcastApi.postServiceStatus('p2p', 'started');
        libp2pInstance$.next(node);
      }, 0);

      return node;
    } catch (err) {
      const msg = err instanceof Error ? err.message : (err as string);
      broadcastApi.postServiceStatus('p2p', 'error', msg);
      throw Error(msg);
    }
  };

  const stop = async () => {
    const node = libp2pInstance$.getValue();

    if (node) {
      await node.stop();
      node.removeEventListener('connection:close');
      node.removeEventListener('connection:open');
      node.removeEventListener('self:peer:update');
    }

    libp2pInstance$.next(undefined);
    broadcastApi.postServiceStatus('p2p', 'inactive');
  };

  const connectPeer = async (address: string) => {
    const conn = await node!.dial(multiaddr(address));
    console.log('----dialed', address, conn);

    return true;
  };

  const subscribeChannel = (channel: string) => {
    node!.services!.pubsub!.subscribe(channel);
    console.log(`* subscribed to p2p: ${channel}`);
  };

  const sendPubSubMessage = (topic: string, message: string) => {
    node!.services!.pubsub!.publish(topic, fromString(message));
    console.log(`[out] [${topic}]: ${message}`);
    broadcastApi.postP2PMessage(topic, message);
  };

  const provideContent = async (cid: string) =>
    node!.contentRouting.provide(stringToCid(cid));

  const api = {
    start,
    stop,
    connectPeer,
    subscribeChannel,
    sendPubSubMessage,
    provideContent,
  };

  return { libp2pInstance$, api };
};

export type P2PApi = ReturnType<typeof createP2PApi>['api'];
