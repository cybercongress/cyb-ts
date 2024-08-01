import { IpfsApi } from 'src/services/backend/workers/background/api/ipfsApi';
import { P2PApi } from 'src/services/backend/workers/background/api/p2p/p2pApi';
import { P2PChannelListener } from 'src/services/backend/workers/background/api/p2p/P2PSyncChannel';
import {
  P2PRequestPins,
  P2PResponsePins,
  PUBSUB_PIN_REQUEST,
  PUBSUB_PIN_RESPONSE,
  PubSubPeerId,
} from 'src/services/backend/workers/background/api/p2p/types';
import { DEFAUL_P2P_SERVICE_TOPIC } from 'src/services/ipfs/config';
import { getPeerIdFromMultiaddresString } from 'src/services/ipfs/utils/peerId';
import { NeuronPeerId, ParticleCid } from 'src/types/base';

class SyncIpfsService {
  private ipfsApi: IpfsApi;

  private p2pApi: P2PApi;

  constructor(ipfsApi: IpfsApi, p2pApi: P2PApi) {
    this.ipfsApi = ipfsApi;
    this.p2pApi = p2pApi;

    // Respose to pin request
    const onMessage = async (message: P2PRequestPins & PubSubPeerId) => {
      const pins = (await this.ipfsApi.pins()).map((res) => res.cid.toString());

      this.p2pApi.sendPubSubMessage(DEFAUL_P2P_SERVICE_TOPIC, {
        type: PUBSUB_PIN_RESPONSE,
        pins,
        peerId: message.peerId,
      });
    };
    const listener = P2PChannelListener(
      onMessage,
      (m) => m.type === PUBSUB_PIN_REQUEST
    );
  }

  private requestPinResult = async (
    peerId: NeuronPeerId
  ): Promise<ParticleCid[]> =>
    new Promise((resolve) => {
      this.p2pApi.sendPubSubMessage(DEFAUL_P2P_SERVICE_TOPIC, {
        type: PUBSUB_PIN_REQUEST,
        peerId,
      });

      const onMessage = (message: P2PResponsePins & PubSubPeerId) => {
        listener.close();

        resolve(message.pins as ParticleCid[]);
      };
      const listener = P2PChannelListener(
        onMessage,
        (m) => m.type === PUBSUB_PIN_RESPONSE && m.peerId === peerId
      );
    });

  public async requestNodePins(address: string) {
    // await this.p2pApi
    //   .connectPeer(address)
    //   .then(() => this.p2pApi.subscribeChannel(DEFAUL_P2P_SERVICE_TOPIC));
    this.p2pApi.subscribeChannel(DEFAUL_P2P_SERVICE_TOPIC);
    const peerId = getPeerIdFromMultiaddresString(address);
    console.log('---requestNodePins', address, peerId);
    const pins = await this.requestPinResult(peerId!);
    return pins;
  }
}

export default SyncIpfsService;
