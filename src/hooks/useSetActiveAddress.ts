import { useEffect, useRef, useState } from 'react';
import { DefaultAccount, AccountValue } from 'src/types/defaultAccount';

function useSetActiveAddress(
  defaultAccount: DefaultAccount,
  noUpdate?: boolean
) {
  const [addressActive, setAddressActive] = useState<AccountValue | null>(null);
  const firstEffectOccured = useRef(false);

  useEffect(() => {
    const { account } = defaultAccount;
    let addressPocket: AccountValue | null = null;
    if (account && account.cyber) {
      const { keys, bech32, name } = account.cyber;
      addressPocket = {
        bech32,
        keys,
      };

      if (name) {
        addressPocket.name = name;
      }
    }

    if (!firstEffectOccured.current) {
      setAddressActive(addressPocket);
    }

    if (!noUpdate && addressPocket) {
      firstEffectOccured.current = true;
    }
  }, [defaultAccount, noUpdate]);

  return { addressActive };
}

export default useSetActiveAddress;
