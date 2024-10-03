/* eslint-disable import/no-unused-modules */
/* eslint-disable import/prefer-default-export */
import {
  DirectSecp256k1HdWallet,
  DirectSecp256k1HdWalletOptions,
} from '@cosmjs/proto-signing/build/directsecp256k1hdwallet';
import { Bip39, EnglishMnemonic } from '@cosmjs/crypto';
import defaultNetworks from 'src/constants/defaultNetworks';

export class CybOfflineSigner extends DirectSecp256k1HdWallet {
  // public async signDirect(
  //   signerAddress: string,
  //   signDoc: SignDoc
  // ): Promise<DirectSignResponse> {
  //   return new Promise((resolve, reject) => {
  //     store.dispatch(shareSignerPromise({ resolve, reject }));
  //     getNavigate()?.('/sign');
  //   }).then(() => {
  //     store.dispatch(resetSignerState());
  //     return super.signDirect(signerAddress, signDoc);
  //   });
  // }

  public static async fromMnemonic(
    mnemonic: string,
    options: Partial<DirectSecp256k1HdWalletOptions> = {}
  ): Promise<CybOfflineSigner> {
    const mnemonicChecked = new EnglishMnemonic(mnemonic);
    const seed = await Bip39.mnemonicToSeed(
      mnemonicChecked,
      options.bip39Password
    );

    const signer = new CybOfflineSigner(mnemonicChecked as any, {
      ...options,
      seed,
    });

    return signer;
  }
}

export const getOfflineSigner = (mnemonic: string) =>
  CybOfflineSigner.fromMnemonic(mnemonic, {
    prefix: defaultNetworks.bostrom.BECH32_PREFIX,
  });
