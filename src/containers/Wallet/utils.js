export const deletPubkey = async (selectAccount, updateFunc) => {
  const localStoragePocketAccount = await localStorage.getItem('pocketAccount');
  const localStoragePocket = await localStorage.getItem('pocket');

  if (localStoragePocketAccount !== null) {
    const localStoragePocketAccountData = JSON.parse(localStoragePocketAccount);
    if (selectAccount !== null && selectAccount.cyber) {
      if (
        Object.prototype.hasOwnProperty.call(
          localStoragePocketAccountData,
          selectAccount.cyber.bech32
        )
      ) {
        delete localStoragePocketAccountData[selectAccount.cyber.bech32];
      }
    }
    if (Object.keys(localStoragePocketAccountData).length > 0) {
      localStorage.setItem(
        'pocketAccount',
        JSON.stringify(localStoragePocketAccountData)
      );
    } else {
      localStorage.removeItem('pocketAccount');
    }
  }
  if (localStoragePocket !== null) {
    const localStoragePocketData = JSON.parse(localStoragePocket);
    if (selectAccount !== null && selectAccount.cyber) {
      if (
        Object.keys(localStoragePocketData)[0] === selectAccount.cyber.bech32
      ) {
        localStorage.removeItem('pocket');
        localStorage.removeItem('linksImport');
      }
    }
  }
  if (updateFunc) {
    updateFunc();
  }
};

export const deleteAccount = async (account, updateFuncCard) => {
  let dataPocketAccount = null;

  const localStoragePocketAccount = await localStorage.getItem('pocketAccount');
  const localStoragePocket = await localStorage.getItem('pocket');
  if (localStoragePocketAccount !== null) {
    dataPocketAccount = JSON.parse(localStoragePocketAccount);
    if (Object.prototype.hasOwnProperty.call(dataPocketAccount, account)) {
      delete dataPocketAccount[account];
      if (Object.keys(dataPocketAccount).length > 0) {
        localStorage.setItem(
          'pocketAccount',
          JSON.stringify(dataPocketAccount)
        );
      } else {
        localStorage.removeItem('pocketAccount');
      }
    }
  }
  if (localStoragePocket !== null) {
    const localStoragePocketData = JSON.parse(localStoragePocket);
    const key0 = Object.keys(localStoragePocketData)[0];
    if (key0 === account) {
      localStorage.removeItem('pocket');
    }
  }
  if (updateFuncCard) {
    updateFuncCard(dataPocketAccount);
  }
};

export const deleteAddress = async (accountName, network, updateFuncCard) => {
  let dataPocketAccount = null;
  const localStoragePocketAccount = await localStorage.getItem('pocketAccount');
  const localStoragePocket = await localStorage.getItem('pocket');
  if (localStoragePocketAccount !== null) {
    dataPocketAccount = JSON.parse(localStoragePocketAccount);
    if (
      Object.prototype.hasOwnProperty.call(dataPocketAccount, accountName) &&
      Object.prototype.hasOwnProperty.call(
        dataPocketAccount[accountName],
        network
      )
    ) {
      delete dataPocketAccount[accountName][network];
      localStorage.setItem('pocketAccount', JSON.stringify(dataPocketAccount));
    }
  }
  if (localStoragePocket !== null) {
    const dataPocket = JSON.parse(localStoragePocket);
    const key0 = Object.keys(dataPocket)[0];
    if (key0 === accountName) {
      if (
        Object.prototype.hasOwnProperty.call(dataPocket, accountName) &&
        Object.prototype.hasOwnProperty.call(dataPocket[accountName], network)
      ) {
        delete dataPocket[accountName][network];
        localStorage.setItem('pocket', JSON.stringify(dataPocket));
      }
    }
  }
  if (updateFuncCard) {
    updateFuncCard(dataPocketAccount, accountName);
  }
};

export const renameKeys = (obj, newKeys) => {
  const keyValues = Object.keys(obj).map((key) => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
};
