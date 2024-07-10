// import { getNodeAutoDialInterval } from './utils-ipfs';
import { IpfsNodeType, IpfsNode, CybIpfsNode, IpfsOptsType } from '../types';
import KuboNode from './impl/kubo';
import HeliaNode from './impl/helia';
import JsIpfsNode from './impl/js-ipfs';
// import EnhancedIpfsNode from './node/enhancedNode';
import {
  CYBERNODE_SWARM_ADDR_TCP,
  CYBERNODE_SWARM_ADDR_WSS,
  CYBER_NODE_SWARM_PEER_ID,
} from '../config';
import { withCybFeatures } from './mixins/withCybFeatures';

const nodeClassMap: Record<IpfsNodeType, new () => IpfsNode> = {
  helia: HeliaNode,
  embedded: JsIpfsNode,
  external: KuboNode,
};

// eslint-disable-next-line import/no-unused-modules, import/prefer-default-export
export async function initIpfsNode(
  options: IpfsOptsType
): Promise<CybIpfsNode> {
  const { ipfsNodeType, ...restOptions } = options;

  const swarmPeerId = CYBER_NODE_SWARM_PEER_ID;

  const swarmPeerAddress =
    ipfsNodeType === 'external'
      ? CYBERNODE_SWARM_ADDR_TCP
      : CYBERNODE_SWARM_ADDR_WSS;
  console.log('[Worker] initIpfsNode', {
    swarmPeerId,
    swarmPeerAddress,
    ipfsNodeType,
  });

  const EnhancedClass = withCybFeatures(nodeClassMap[ipfsNodeType], {
    swarmPeerId,
    swarmPeerAddress,
  });
  console.log('[Worker] initIpfsNode', { EnhancedClass });

  const instance = new EnhancedClass();
  console.log('[Worker] initIpfsNode before init', { instance });

  try {
    await instance.init({ url: restOptions.urlOpts });
  } catch (error) {
    console.log('[Worker] initIpfsNode instance init failed', error);
  }
  console.log('[Worker] initIpfsNode after instance init');
  // TODO: REFACT
  //   instance.connMgrGracePeriod = await getNodeAutoDialInterval(instance);
  // window.ipfs = instance;

  console.log('----init', ipfsNodeType);

  await instance.reconnectToSwarm();
  return instance;
}
