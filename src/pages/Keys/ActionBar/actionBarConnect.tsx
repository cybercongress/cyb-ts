/* eslint-disable */
import { useEffect, useState } from 'react';
import { Pane } from '@cybercongress/gravity';
import {
  Dots,
  ConnectAddress,
  TransactionError,
  Input,
  ActionBar,
} from 'src/components';
import { LEDGER, CYBER, PATTERN_CYBER } from 'src/utils/config';
import { useSigningClient } from 'src/contexts/signerClient';
import { useDispatch } from 'react-redux';
import { initPocket, setDefaultAccount } from 'src/redux/features/pocket';

const { STAGE_INIT, HDPATH, STAGE_ERROR } = LEDGER;

const STAGE_ADD_ADDRESS_USER = 2.1;
const STAGE_ADD_ADDRESS_OK = 2.2;

const checkAddress = (obj, network, address) =>
  Object.keys(obj).some((k) => {
    if (obj[k][network]) {
      return obj[k][network].bech32 === address;
    }
  });

function ActionBarConnect({
  addAddress,
  updateAddress,
  updateFuncActionBar,
  onClickBack,
  selectAccount,
}) {
  const { signer } = useSigningClient();
  const [stage, setStage] = useState(STAGE_INIT);
  const [valueInputAddres, setValueInputAddres] = useState('');
  const [selectMethod, setSelectMethod] = useState('');
  const selectNetwork = 'cyber';
  const [addCyberAddress, setAddCyberAddress] = useState(false);
  const [validAddressAddedUser, setValidAddressAddedUser] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    if (addAddress === false && stage === STAGE_ADD_ADDRESS_OK) {
      clearState();
    }
  }, [stage, addAddress]);

  useEffect(() => {
    if (valueInputAddres.match(PATTERN_CYBER)) {
      setValidAddressAddedUser(false);
    } else {
      setValidAddressAddedUser(true);
    }
  }, [valueInputAddres]);

  const connctAddress = () => {
    switch (selectMethod) {
      case 'keplr':
        connectKeplr();
        break;

      default:
        onClickAddAddressUser();
        break;
    }
  };

  const clearState = () => {
    setStage(STAGE_INIT);
    setValueInputAddres('');
    setSelectMethod('');
    setAddCyberAddress(false);
    setValidAddressAddedUser(true);
  };

  const onClickAddAddressUser = () => {
    setStage(STAGE_ADD_ADDRESS_USER);
  };

  const onClickAddAddressUserToLocalStr = async () => {
    const accounts = {};
    let key = 'Account 1';
    let dataPocketAccount = null;
    let pocketAccount = {};
    let valueObj = {};
    let count = 1;

    const localStorageStory = await localStorage.getItem('pocketAccount');
    const localStoragePocket = await localStorage.getItem('pocket');
    const localStorageCount = await localStorage.getItem('count');
    if (localStorageCount !== null) {
      const dataCount = JSON.parse(localStorageCount);
      count = parseFloat(dataCount);
      key = `Account ${count}`;
    }
    localStorage.setItem('count', JSON.stringify(count + 1));
    if (localStorageStory !== null) {
      dataPocketAccount = JSON.parse(localStorageStory);
      valueObj = Object.values(dataPocketAccount);
      if (selectAccount !== null) {
        key = selectAccount.key;
      }
    }
    if (selectNetwork === 'cyber' || addCyberAddress) {
      let cyberAddress = null;
      if (valueInputAddres.match(PATTERN_CYBER)) {
        cyberAddress = valueInputAddres;
      }

      if (
        selectAccount !== null ||
        !checkAddress(valueObj, 'cyber', cyberAddress)
      ) {
        accounts.cyber = { bech32: cyberAddress, keys: 'read-only' };
      }
    }

    setStage(STAGE_ADD_ADDRESS_OK);
    if (selectAccount === null) {
      if (localStorageStory !== null) {
        if (Object.keys(accounts).length > 0) {
          pocketAccount = { [key]: accounts, ...dataPocketAccount };
        }
      } else {
        pocketAccount = { [key]: accounts };
      }

      if (Object.keys(pocketAccount).length > 0) {
        localStorage.setItem('pocketAccount', JSON.stringify(pocketAccount));
        clearState();
        if (updateAddress) {
          updateAddress();
        }
        if (updateFuncActionBar) {
          updateFuncActionBar();
        }
      } else {
        setStage(STAGE_ERROR);
      }
    } else {
      dataPocketAccount[selectAccount.key][selectNetwork] =
        accounts[selectNetwork];
      if (Object.keys(dataPocketAccount).length > 0) {
        localStorage.setItem(
          'pocketAccount',
          JSON.stringify(dataPocketAccount)
        );
      }
      if (localStoragePocket !== null) {
        const localStoragePocketData = JSON.parse(localStoragePocket);
        const keyPocket = Object.keys(localStoragePocketData)[0];
        localStoragePocketData[keyPocket][selectNetwork] =
          accounts[selectNetwork];
        if (keyPocket === selectAccount.key) {
          localStorage.setItem(
            'pocket',
            JSON.stringify(localStoragePocketData)
          );
        }
      }
      clearState();
      if (updateAddress) {
        updateAddress();
      }
      if (updateFuncActionBar) {
        updateFuncActionBar();
      }
    }
  };

  const connectKeplr = async () => {
    console.log('signer', signer);
    if (signer) {
      const accounts = {};
      let key = 'Account 1';
      let dataPocketAccount = null;
      let valueObj = {};
      let pocketAccount = {};
      const chainId = CYBER.CHAIN_ID;
      let count = 1;
      const { bech32Address, pubKey, name } = await signer.keplr.getKey(
        chainId
      );
      const pk = Buffer.from(pubKey).toString('hex');

      const localStorageStory = localStorage.getItem('pocketAccount');
      const localStoragePocket = localStorage.getItem('pocket');
      const localStorageCount = localStorage.getItem('count');
      if (localStorageCount !== null) {
        const dataCount = JSON.parse(localStorageCount);
        count = parseFloat(dataCount);
        key = `Account ${count}`;
      }
      localStorage.setItem('count', JSON.stringify(count + 1));
      if (localStorageStory !== null) {
        dataPocketAccount = JSON.parse(localStorageStory);
        valueObj = Object.values(dataPocketAccount);
        if (selectAccount !== null) {
          key = selectAccount.key;
        }
      }
      if (selectNetwork === 'cyber' || addCyberAddress) {
        const cyberBech32 = bech32Address;
        if (
          selectAccount !== null ||
          !checkAddress(valueObj, 'cyber', cyberBech32)
        ) {
          accounts.cyber = {
            bech32: cyberBech32,
            keys: 'keplr',
            pk,
            path: HDPATH,
            name,
          };
        }
      }

      setStage(STAGE_ADD_ADDRESS_OK);
      if (selectAccount === null) {
        if (localStorageStory !== null) {
          if (Object.keys(accounts).length > 0) {
            pocketAccount = { [key]: accounts, ...dataPocketAccount };
          }
        } else {
          pocketAccount = { [key]: accounts };
        }
        if (Object.keys(pocketAccount).length > 0) {
          localStorage.setItem('pocketAccount', JSON.stringify(pocketAccount));
        }
      } else {
        dataPocketAccount[selectAccount.key][selectNetwork] =
          accounts[selectNetwork];
        if (Object.keys(dataPocketAccount).length > 0) {
          localStorage.setItem(
            'pocketAccount',
            JSON.stringify(dataPocketAccount)
          );
        }
        if (localStoragePocket !== null) {
          const localStoragePocketData = JSON.parse(localStoragePocket);
          const keyPocket = Object.keys(localStoragePocketData)[0];
          localStoragePocketData[keyPocket][selectNetwork] =
            accounts[selectNetwork];
          if (keyPocket === selectAccount.key) {
            localStorage.setItem(
              'pocket',
              JSON.stringify(localStoragePocketData)
            );
          }
        }
      }

      // need remove code above
      dispatch(initPocket());
      setTimeout(() => {
        dispatch(setDefaultAccount({ name: key }));
      }, 100);

      clearState();
      if (updateAddress) {
        updateAddress();
      }
      if (updateFuncActionBar) {
        updateFuncActionBar();
      }
    }
  };

  const selectMethodFunc = (method) => {
    if (method !== selectMethod) {
      setSelectMethod(method);
    } else {
      setSelectMethod('');
    }
  };

  if (stage === STAGE_INIT) {
    return (
      <ConnectAddress
        selectMethodFunc={selectMethodFunc}
        selectMethod={selectMethod}
        selectNetwork={selectNetwork}
        connctAddress={connctAddress}
        keplr={signer}
        onClickBack={onClickBack}
      />
    );
  }

  if (stage === STAGE_ADD_ADDRESS_USER) {
    return (
      <ActionBar
        button={{
          disabled: validAddressAddedUser,
          onClick: onClickAddAddressUserToLocalStr,
          text: 'Add address',
        }}
        onClickBack={() => setStage(STAGE_INIT)}
      >
        <Pane
          flex={1}
          justifyContent="center"
          alignItems="center"
          fontSize="18px"
          display="flex"
        >
          put {selectNetwork} address:
          <Input
            width="250px"
            value={valueInputAddres}
            onChange={(e) => setValueInputAddres(e.target.value)}
            placeholder="address"
            autoFocus
          />
        </Pane>
      </ActionBar>
    );
  }

  if (stage === STAGE_ADD_ADDRESS_OK) {
    return (
      <ActionBar>
        <Pane display="flex" alignItems="center">
          <Pane fontSize={20}>adding address</Pane>
          <Dots big />
        </Pane>
      </ActionBar>
    );
  }

  if (stage === STAGE_ERROR) {
    return (
      <TransactionError
        onClickBtn={() => clearState()}
        errorMessage="you have this address in your pocket"
      />
    );
  }

  return null;
}

export default ActionBarConnect;
