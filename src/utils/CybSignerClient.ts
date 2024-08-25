import { OfflineSigner } from '@cosmjs/proto-signing';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import {
  SigningCyberClient,
  SigningCyberClientOptions,
} from '@cybercongress/cyber-js';
import {
  resetSignerState,
  setFee,
  setMessages,
  shareSignerPromise,
} from 'src/redux/features/signer';
import store from 'src/redux/store';
import { getNavigate } from './shareNavigation';

// eslint-disable-next-line import/no-unused-modules, import/prefer-default-export
export class CybSignerClient extends SigningCyberClient {
  signAndBroadcast(
    ...args: Parameters<SigningCyberClient['signAndBroadcast']>
  ) {
    return new Promise((resolve, reject) => {
      const [, messages, fee] = args;
      store.dispatch(setFee(fee));
      store.dispatch(setMessages([...messages]));

      const { confirmation } = store.getState().signer;
      if (confirmation) {
        store.dispatch(shareSignerPromise({ resolve, reject }));
        getNavigate()?.('/sign');
      } else {
        resolve({});
      }
    }).then(() => {
      const [signerAddress, messages, fee] = args;
      const { memo } = store.getState().signer;

      return super
        .signAndBroadcast(signerAddress, messages, fee, memo ?? '')
        .finally(() => {
          store.dispatch(resetSignerState());
        });
    });
  }

  public static async connectWithSigner(
    endpoint: string,
    signer: OfflineSigner,
    options: SigningCyberClientOptions = {}
  ): Promise<SigningCyberClient> {
    const tmClient = await Tendermint34Client.connect(endpoint);
    return new CybSignerClient(tmClient as any, signer, options);
  }
}