import * as external from './external';
import * as embedded from './embedded';
import {
  reconnectToCyberSwarm,
  getIpfsConfigGatewayAddr,
  getIpfsConfigSwarmConnTimeout,
} from './utils-ipfs';
import { AppIPFS, IpfsOptsType } from './ipfs';

let client: AppIPFS | null = null;

export async function ipfsClientFactory(opts: IpfsOptsType) {
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

  instance.gatewayAddr = await getIpfsConfigGatewayAddr(instance);
  instance.swarmConnTimeout = await getIpfsConfigSwarmConnTimeout(instance);

  // Only for embedded node
  // if (instance.libp2p) {
  //   // instance.libp2p.addEventListener('peer:discovery', (evt) => {
  //   //   // window.discoveredPeers.set(evt.detail.id.toString(), evt.detail)
  //   //   // console.log(`Discovered peer ${evt.detail.id.toString()}`);
  //   // });
  //   instance.libp2p.addEventListener('peer:connect', (evt) => {
  //     console.log(`Connected to ${evt.detail.remotePeer.toString()}`);
  //   });
  //   instance.libp2p.addEventListener('peer:disconnect', (evt) => {
  //     console.log(`Disconnected from ${evt.detail.remotePeer.toString()}`);
  //   });

  //   // connectToSwarm(
  //   //   instance,
  //   //   '/dns4/ws-star.discovery.cybernode.ai/tcp/443/wss/p2p-webrtc-star'
  //   // );
  // }
  await reconnectToCyberSwarm(instance);
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
