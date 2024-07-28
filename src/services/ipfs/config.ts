import { IPFSNodes, IpfsOptsType } from './types';
import { getOrCreatePeerIdJson } from './utils/peerId';

export const CYBER_NODE_SWARM_PEER_ID =
  'QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB';

export const CYBERNODE_SWARM_ADDR_WSS = `/dns4/swarm.io.cybernode.ai/tcp/443/wss/p2p/${CYBER_NODE_SWARM_PEER_ID}`;
export const CYBERNODE_SWARM_ADDR_TCP = `/ip4/88.99.105.146/tcp/4001/p2p/${CYBER_NODE_SWARM_PEER_ID}`;
export const CYBERNODE_PUBSUB_NODE =
  '/dns4/acidpictures.ink/tcp/4444/wss/p2p/12D3KooWE3yj6jibgZcxMb6hrpQGKRE9xaqAazFkYaJZDZengzHq';

export const IPFS_CLUSTER_URL = 'https://io.cybernode.ai';

export const CYBER_GATEWAY_URL = 'https://gateway.ipfs.cybernode.ai';

export const FILE_SIZE_DOWNLOAD = 20 * 10 ** 6;

export const DEFAUL_P2P_TOPIC = 'cyber';

// eslint-disable-next-line import/no-unused-modules
export const getIpfsOpts = async () => {
  let ipfsOptsDefault: Omit<IpfsOptsType, 'peerId'> = {
    ipfsNodeType: IPFSNodes.HELIA,
    urlOpts: '/ip4/127.0.0.1/tcp/5001', // default url
    userGateway: 'http://127.0.0.1:8080',
  };

  // get type ipfs
  const lsTypeIpfs = localStorage.getItem('ipfsState');
  if (lsTypeIpfs) {
    const lsTypeIpfsData = JSON.parse(lsTypeIpfs);
    ipfsOptsDefault = { ...ipfsOptsDefault, ...lsTypeIpfsData };
  }

  localStorage.setItem('ipfsState', JSON.stringify(ipfsOptsDefault));
  const peerId = await getOrCreatePeerIdJson();

  return { ...ipfsOptsDefault, peerId } as IpfsOptsType;
};
