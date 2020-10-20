const deletPubkey = async (selectAccount, updateFunc) => {
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

export { deletPubkey };
