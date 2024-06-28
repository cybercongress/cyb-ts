import { useAppSelector } from 'src/redux/hooks';
import useCurrentAddress from './useCurrentAddress';
import { fromBech32 } from 'src/utils/utils';

function useCurrentPassport() {
  const currentAddress = useCurrentAddress();

  const bostromAddress =
    currentAddress && fromBech32(currentAddress, 'bostrom');

  const currentPassport = useAppSelector((store) =>
    bostromAddress ? store.passports[bostromAddress] : null
  );
  return currentPassport;
}

export default useCurrentPassport;
