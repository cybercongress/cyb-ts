/* eslint-disable import/prefer-default-export */
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { SignDoc } from '@keplr-wallet/types/build/cosmjs';
import defaultNetworks from 'src/constants/defaultNetworks';

export class OfflineSigner extends DirectSecp256k1HdWallet {
  signDirect: DirectSecp256k1HdWallet['signDirect'] = (
    signerAddress: string,
    signDoc: SignDoc
  ) => {
    console.log({ signerAddress, signDoc });

    return super.signDirect(signerAddress, signDoc);
  };
}

export const getOfflineSigner = (mnemonic: string) =>
  OfflineSigner.fromMnemonic(mnemonic, {
    prefix: defaultNetworks.bostrom.BECH32_PREFIX,
  });

export const initTestOfflineSigner = () => {
  return getOfflineSigner(
    // 'walk pilot space strike parrot fuel involve mass air bronze bitter morning hockey trial room focus stamp indicate penalty sketch juice volume rather donor'
    'program vast lesson soldier lucky power cost tragic train combine minute wonder'
  );
};
