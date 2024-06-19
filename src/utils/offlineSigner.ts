/* eslint-disable import/no-unused-modules */
/* eslint-disable import/prefer-default-export */
import {
  DirectSecp256k1HdWallet,
  DirectSecp256k1HdWalletOptions,
} from '@cosmjs/proto-signing/build/directsecp256k1hdwallet';
import { Bip39, EnglishMnemonic } from '@cosmjs/crypto';
import { SignDoc } from '@keplr-wallet/types/build/cosmjs';
import defaultNetworks from 'src/constants/defaultNetworks';
import { DirectSignResponse } from '@cosmjs/proto-signing/build/signer';
import store from 'src/redux/store';
import { closeSignerModal, openSignerModal } from 'src/redux/reducers/signer';

export class CybOfflineSigner extends DirectSecp256k1HdWallet {
  public async signDirect(
    signerAddress: string,
    signDoc: SignDoc
  ): Promise<DirectSignResponse> {
    return new Promise((resolve, reject) => {
      store.dispatch(openSignerModal({ resolve, reject }));
    }).then(() => {
      store.dispatch(closeSignerModal());
      return super.signDirect(signerAddress, signDoc);
    });
  }

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

export const initTestOfflineSigner = () => {
  return getOfflineSigner(
    // 'walk pilot space strike parrot fuel involve mass air bronze bitter morning hockey trial room focus stamp indicate penalty sketch juice volume rather donor'
    'program vast lesson soldier lucky power cost tragic train combine minute wonder'
  );
};
