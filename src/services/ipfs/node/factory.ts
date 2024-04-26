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

  const EnhancedClass = withCybFeatures(nodeClassMap[ipfsNodeType], {
    swarmPeerId,
    swarmPeerAddress,
  });

  const instance = new EnhancedClass();

  await instance.init({ url: restOptions.urlOpts });
  // TODO: REFACT
  //   instance.connMgrGracePeriod = await getNodeAutoDialInterval(instance);
  // window.ipfs = instance;

  console.log('----init', ipfsNodeType);

  await instance.reconnectToSwarm();
  return instance;
}
