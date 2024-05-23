import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import defaultNetworks from 'src/constants/defaultNetworks';

export const getOfflineSigner = (mnemonic: string) =>
  DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: defaultNetworks.bostrom.BECH32_PREFIX,
  });

export const initOfflineSigner = () => {
  return getOfflineSigner(
    'walk pilot space strike parrot fuel involve mass air bronze bitter morning hockey trial room focus stamp indicate penalty sketch juice volume rather donor'
  );
};
