import { useEffect, useState } from 'react';
import { DefaultAccount, AccountValue } from 'src/types/defaultAccount';

function useSetActiveAddress(defaultAccount: DefaultAccount) {
  const [addressActive, setAddressActive] = useState<AccountValue | null>(
    null
  );

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
    setAddressActive(addressPocket);
  }, [defaultAccount.name]);

  return { addressActive };
}

export default useSetActiveAddress;
