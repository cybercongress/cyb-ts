import { useEffect, useState } from 'react';
import { DefaultAccountType, AccountValueType } from 'src/types/defaultAccount';

function useSetActiveAddress(defaultAccount: DefaultAccountType) {
  const [addressActive, setAddressActive] = useState<AccountValueType | null>(
    null
  );

  useEffect(() => {
    const { account } = defaultAccount;
    let addressPocket: AccountValueType | null = null;
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
