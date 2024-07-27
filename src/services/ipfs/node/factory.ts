import { Libp2p } from 'libp2p';

import { IpfsNodeType, IpfsNode, CybIpfsNode, IpfsOptsType } from '../types';

import KuboNode from './impl/kubo';
import HeliaNode from './impl/helia';
import {
  CYBERNODE_SWARM_ADDR_TCP,
  CYBERNODE_SWARM_ADDR_WSS,
  CYBER_NODE_SWARM_PEER_ID,
} from '../config';
import withCybFeatures from './mixins/withCybFeatures';

const nodeClassMap: Record<IpfsNodeType, new () => IpfsNode> = {
  helia: HeliaNode,
  external: KuboNode,
};

// eslint-disable-next-line import/no-unused-modules, import/prefer-default-export
export async function initIpfsNode(
  options: IpfsOptsType,
  libp2p?: Libp2p
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

  await instance.init({ url: restOptions.urlOpts }, libp2p);
  // TODO: REFACT
  //   instance.connMgrGracePeriod = await getNodeAutoDialInterval(instance);
  // window.ipfs = instance;

  await instance.reconnectToSwarm();
  return instance;
}
