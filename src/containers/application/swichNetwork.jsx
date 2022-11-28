import React, { useContext, useEffect } from 'react';
import { CYBER } from '../../utils/config';
import { fromBech32 } from '../../utils/utils';
import { ButtonNetwork, Tooltip } from '../../components';
import { AppContext } from '../../context';

const forEachObjbech32 = (data, prefix) => {
  const newObj = {};
  Object.keys(data).forEach((key) => {
    const valueObj = data[key];
    if (Object.prototype.hasOwnProperty.call(valueObj, 'cyber')) {
      const { bech32 } = valueObj.cyber;
      const bech32NewPrefix = fromBech32(bech32, prefix);
      newObj[key] = {
        ...valueObj,
        cyber: {
          ...valueObj.cyber,
          bech32: bech32NewPrefix,
        },
      };
    }
  });
  return newObj;
};

const updateAddress = async (prefix) => {
  const localStoragePocketAccount = await localStorage.getItem('pocketAccount');
  const localStoragePocket = await localStorage.getItem('pocket');

  if (localStoragePocket !== null) {
    const localStoragePocketData = JSON.parse(localStoragePocket);
    const newObjPocketData = forEachObjbech32(localStoragePocketData, prefix);
    localStorage.setItem('pocket', JSON.stringify(newObjPocketData));
  }
  if (localStoragePocketAccount !== null) {
    const localStoragePocketAccountData = JSON.parse(localStoragePocketAccount);
    const newObjAccountData = forEachObjbech32(
      localStoragePocketAccountData,
      prefix
    );
    localStorage.setItem('pocketAccount', JSON.stringify(newObjAccountData));
  }
};

function SwichNetwork({ children }) {
  const { networks } = useContext(AppContext);

  const onClickChain = async (chainId, prefix) => {
    localStorage.setItem('chainId', chainId);
    await updateAddress(prefix);
    window.location.reload();
  };

  const renderItemChain = Object.keys(networks).map((key) => (
    <ButtonNetwork
      disabled={CYBER.CHAIN_ID === key}
      onClick={() =>
        onClickChain(key, networks[key].BECH32_PREFIX_ACC_ADDR_CYBER)
      }
      network={key}
    />
  ));

  return (
    <Tooltip
      placement="bottom"
      tooltip={
        <div style={{ minWidth: '150px', textAlign: 'center' }}>
          {renderItemChain}
        </div>
      }
    >
      <>{children}</>
    </Tooltip>
  );
}

export default SwichNetwork;
