import { useEffect, useState } from 'react';

function useSetActiveAddress(defaultAccount) {
  const [addressActive, setAddressActive] = useState(null);

  useEffect(() => {
    const { account } = defaultAccount;
    let addressPocket = null;
    if (
      account !== null &&
      Object.prototype.hasOwnProperty.call(account, 'cyber')
    ) {
      const { keys, bech32 } = account.cyber;
      addressPocket = {
        bech32,
        keys,
      };
    }
    setAddressActive(addressPocket);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAccount.name]);

  return { addressActive };
}

export default useSetActiveAddress;
