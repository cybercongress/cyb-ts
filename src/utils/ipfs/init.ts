import * as external from './external';
import * as embedded from './embedded';
import { getNodeAutoDialInterval, reconnectToCyberSwarm } from './utils-ipfs';
import { AppIPFS } from './ipfs';

let client;

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
  instance.connMgrGracePeriod = await getNodeAutoDialInterval(instance);
  // window.ipfs = instance;

  // Only for embedded node
  if (instance.libp2p) {
    // instance.libp2p.addEventListener('peer:discovery', (evt) => {
    //   // window.discoveredPeers.set(evt.detail.id.toString(), evt.detail)
    //   // console.log(`Discovered peer ${evt.detail.id.toString()}`);
    // });
    instance.libp2p.addEventListener('peer:connect', (evt) => {
      console.debug(`Connected to ${evt.detail.remotePeer.toString()}`);
    });
    instance.libp2p.addEventListener('peer:disconnect', (evt) => {
      console.debug(`Disconnected from ${evt.detail.remotePeer.toString()}`);
    });

    // connectToSwarm(
    //   instance,
    //   '/dns4/ws-star.discovery.cybernode.ai/tcp/443/wss/p2p-webrtc-star'
    // );
  }
  await reconnectToCyberSwarm(instance);
  client = backend;
  return instance as AppIPFS;
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
