import { IpfsNode, CybIpfsNode, IPFSContentMeta } from '../../ipfs';

type WithCybFeaturesOptions = {
  swarmPeerId: string;
  swarmPeerAddress: string;
};

function withCybFeatures<TBase extends new (...args: any[]) => IpfsNode>(
  Base: TBase,
  options: WithCybFeaturesOptions
) {
  return class SwarmReconnect extends Base implements CybIpfsNode {
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
