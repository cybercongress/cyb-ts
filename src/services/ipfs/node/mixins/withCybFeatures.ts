import { IpfsNode, CybIpfsNode, IpfsContentType } from '../../types';
import { parseArrayLikeToDetails } from '../../utils/content';
import { addContenToIpfs, getIPFSContent } from '../../utils/utils-ipfs';

type WithCybFeaturesOptions = {
  swarmPeerId: string;
  swarmPeerAddress: string;
};

function withCybFeatures<TBase extends new (...args: any[]) => IpfsNode>(
  Base: TBase,
  options: WithCybFeaturesOptions
) {
  return class CybIpfsNodeMixin extends Base implements CybIpfsNode {
    async fetchWithDetails(cid: string, parseAs?: IpfsContentType) {
      const response = await getIPFSContent(cid, this);
      const details = await parseArrayLikeToDetails(response, cid);

      return !parseAs
        ? details
        : details?.type === parseAs
        ? details
        : undefined;
    }

    async addContent(content: File | string) {
      return addContenToIpfs(this, content);
    }

    async isConnectedToSwarm() {
      return !!(await super.getPeers()).find(
        (peerId) => peerId === options.swarmPeerId
      );
    }

    async reconnectToSwarm(lastConnectedTimestamp?: number) {
      if (!(await this.isConnectedToSwarm())) {
        // TODO: refactor using timeout for node config

        //   const needToReconnect =
        //     Date.now() - lastConnectedTimestamp <
        //     DEFAULT_CONNECTION_LIFETIME_SECONDS;
        super
          .connectPeer(options.swarmPeerAddress)
          .then(() => {
            console.log(`🐝 connected to swarm - ${options.swarmPeerAddress}`);
            return true;
          })
          .catch((err) => {
            console.log(
              `Can't connect to swarm ${options.swarmPeerAddress}: ${err.message}`
            );
            return false;
          });
      }
    }
  };
}

export { withCybFeatures };
