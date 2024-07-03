import { OfflineSigner } from '@cosmjs/proto-signing';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import {
  SigningCyberClient,
  SigningCyberClientOptions,
} from '@cybercongress/cyber-js';
import {
  resetSignerState,
  shareSignerPromise,
} from 'src/redux/reducers/signer';
import store from 'src/redux/store';
import { getNavigate } from './shareNavigation';

// eslint-disable-next-line import/no-unused-modules, import/prefer-default-export
export class CybSignerClient extends SigningCyberClient {
  signAndBroadcast(
    ...args: Parameters<SigningCyberClient['signAndBroadcast']>
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      store.dispatch(shareSignerPromise({ resolve, reject }));
      getNavigate()?.('/sign');
    }).then(({ memo }) => {
      const [signerAddress, messages, fee] = args;
      console.log('MEMO', memo, fee);

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
