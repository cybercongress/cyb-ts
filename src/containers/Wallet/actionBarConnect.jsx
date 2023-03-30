/* eslint-disable */
import { useEffect, useState } from 'react';
import { Pane, ActionBar, Button } from '@cybercongress/gravity';
import {
  ConnectLadger,
  Dots,
  ConnectAddress,
  TransactionError,
} from '../../components';
import {
  LEDGER,
  CYBER,
  PATTERN_COSMOS,
  PATTERN_CYBER,
} from '../../utils/config';
import { fromBech32 } from '../../utils/utils';

const { STAGE_INIT, STAGE_LEDGER_INIT, HDPATH, LEDGER_OK, STAGE_ERROR } =
  LEDGER;

const STAGE_ADD_ADDRESS_LEDGER = 1.1;
const STAGE_ADD_ADDRESS_USER = 2.1;
const STAGE_ADD_ADDRESS_OK = 2.2;
const LEDGER_TX_ACOUNT_INFO = 2.5;
const STAGE_HDPATH = 1.7;

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
  keplr,
  web3,
  accountsETH,
  selectAccount,
}) {
  const [stage, setStage] = useState(STAGE_INIT);
  const [hdpath, setHDpath] = useState([44, 118, 0, 0, 0]);
  const [connectLedger, setConnectLedger] = useState(null);
  const [valueInputAddres, setValueInputAddres] = useState('');
  const [selectMethod, setSelectMethod] = useState('');
  const [selectNetwork, setSelectNetwork] = useState('');
  const [hdPathError, setHdPathError] = useState(false);
  const [addressLedger, setAddressLedger] = useState(null);
  const [addCyberAddress, setAddCyberAddress] = useState(false);
  const [validAddressAddedUser, setValidAddressAddedUser] = useState(true);

  useEffect(() => {
    if (addAddress === false && stage === STAGE_ADD_ADDRESS_OK) {
      cleatState();
    }
  }, [stage, addAddress]);

  useEffect(() => {
    if (selectAccount && selectAccount !== null) {
      if (selectAccount.cosmos && selectMethod !== 'MetaMask') {
        setSelectNetwork('cyber');
      }

      if (selectAccount.cyber && selectMethod !== 'MetaMask') {
        setSelectNetwork('cosmos');
      }

      if (selectAccount.cyber && selectAccount.cosmos) {
        setSelectMethod('MetaMask');
        setSelectNetwork('eth');
      }
    } else {
      setSelectNetwork('cyber');
    }
  }, [selectAccount, selectMethod]);

  useEffect(() => {
    if (selectNetwork === 'cyber') {
      if (valueInputAddres.match(PATTERN_CYBER)) {
        setValidAddressAddedUser(false);
      } else {
        setValidAddressAddedUser(true);
      }
    }

    if (selectNetwork === 'cosmos') {
      if (valueInputAddres.match(PATTERN_COSMOS)) {
        setValidAddressAddedUser(false);
      } else {
        setValidAddressAddedUser(true);
      }
    }
  }, [valueInputAddres]);

  const connctAddress = () => {
    switch (selectMethod) {

      case 'keplr':
        connectKeplr();
        break;

      case 'MetaMask':
        onClickConnectWeb3();
        break;

      default:
        onClickAddAddressUser();
        break;
    }
  };

  const cleatState = () => {
    setStage(STAGE_INIT);
    setValueInputAddres('');
    setHDpath(HDPATH);
    setConnectLedger(null);
    setSelectMethod('');
    setSelectNetwork('');
    setHdPathError(false);
    setAddressLedger(null);
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
      if (valueInputAddres.match(PATTERN_COSMOS)) {
        cyberAddress = fromBech32(
          valueInputAddres,
          CYBER.BECH32_PREFIX_ACC_ADDR_CYBER
        );
      }
      if (
        selectAccount !== null ||
        !checkAddress(valueObj, 'cyber', cyberAddress)
      ) {
        accounts.cyber = { bech32: cyberAddress, keys: 'read-only' };
      }
    }
    if (selectNetwork === 'cosmos') {
      const cosmosAddress = valueInputAddres;
      if (
        selectAccount !== null ||
        !checkAddress(valueObj, 'cosmos', cosmosAddress)
      ) {
        accounts.cosmos = { bech32: cosmosAddress, keys: 'read-only' };
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
        cleatState();
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
      cleatState();
      if (updateAddress) {
        updateAddress();
      }
      if (updateFuncActionBar) {
        updateFuncActionBar();
      }
    }
  };

  const onClickConnectWeb3 = async () => {
    const accounts = {};
    let key = 'Account 1';
    let dataPocketAccount = null;
    let pocketAccount = {};
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
      if (selectAccount !== null) {
        key = selectAccount.key;
      }
    }
    if (web3.currentProvider.host) {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
    if (window.ethereum) {
      try {
        const address = await window.ethereum.enable();
        console.log('ethereum', address);
        accounts.eth = { bech32: address[0], keys: 'MetaMask' };
      } catch (error) {
        console.log('You declined transaction', error);
      }
    } else if (window.web3) {
      const getAccounts = await web3.eth.getAccounts();
      accounts.eth = { bech32: getAccounts[0], keys: 'MetaMask' };
      console.log('getAccounts', getAccounts);
    } else {
      console.log('Your metamask is locked!');
    }
    if (Object.keys(accounts).length > 0) {
      if (selectAccount === null) {
        if (localStorageStory !== null) {
          const valueObj = Object.values(dataPocketAccount);
          if (!checkAddress(valueObj, 'eth', accounts.eth.bech32)) {
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
      cleatState();
      if (updateAddress) {
        updateAddress();
      }
      if (updateFuncActionBar) {
        updateFuncActionBar();
      }
    }
  };

  const connectKeplr = async () => {
    const accounts = {};
    let key = 'Account 1';
    let dataPocketAccount = null;
    let valueObj = {};
    let pocketAccount = {};
    const chainId = CYBER.CHAIN_ID;
    await window.keplr.enable(chainId);
    let count = 1;
    const { bech32Address, pubKey, name } = await keplr.signer.keplr.getKey(
      chainId
    );
    const pk = Buffer.from(pubKey).toString('hex');

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
    if (selectNetwork === 'cosmos') {
      const cosmosAddress = fromBech32(bech32Address, 'cosmos');
      const cosmosBech32 = cosmosAddress;
      if (
        selectAccount !== null ||
        !checkAddress(valueObj, 'cosmos', cosmosBech32)
      ) {
        accounts.cosmos = {
          bech32: cosmosBech32,
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
    cleatState();
    if (updateAddress) {
      updateAddress();
    }
    if (updateFuncActionBar) {
      updateFuncActionBar();
    }
  };

  const onChangeAccount = (e) => {
    let value = null;
    if (e.target.value === '') {
      const copyArr = [...hdpath];
      copyArr[2] = value;
      setHDpath(copyArr);
    }
    if (e.target.value) {
      value = parseInt(e.target.value, 10);
      if (Number.isNaN(value)) {
        const copyArr = [...hdpath];
        copyArr[2] = '';
        setHDpath(copyArr);
      } else {
        const copyArr = [...hdpath];
        copyArr[2] = value;
        setHDpath(copyArr);
      }
    }
  };

  const onChangeIndex = (e) => {
    let value = null;
    if (e.target.value === '') {
      const copyArr = [...hdpath];
      copyArr[4] = value;
      setHDpath(copyArr);
    }
    if (e.target.value) {
      value = parseInt(e.target.value, 10);
      if (Number.isNaN(value)) {
        const copyArr = [...hdpath];
        copyArr[4] = '';
        setHDpath(copyArr);
      } else {
        const copyArr = [...hdpath];
        copyArr[4] = value;
        setHDpath(copyArr);
      }
    }
  };

  const selectMethodFunc = (method) => {
    setSelectNetwork('');
    if (method !== selectMethod) {
      setSelectMethod(method);
    } else {
      setSelectMethod('');
    }
  };

  const selectNetworkFunc = (network) => {
    if (network !== selectNetwork) {
      setSelectNetwork(network);
    } else {
      setSelectNetwork('');
    }
  };

  if (stage === STAGE_INIT) {
    return (
      <ConnectAddress
        selectMethodFunc={selectMethodFunc}
        selectMethod={selectMethod}
        selectNetworkFunc={selectNetworkFunc}
        selectNetwork={selectNetwork}
        connctAddress={connctAddress}
        web3={web3}
        selectAccount={selectAccount}
        keplr={keplr}
      />
    );
  }

  if (stage === STAGE_ADD_ADDRESS_USER) {
    return (
      <ActionBar>
        <Pane
          flex={1}
          justifyContent="center"
          alignItems="center"
          fontSize="18px"
          display="flex"
        >
          put {selectNetwork} address:
          <input
            value={valueInputAddres}
            style={{
              height: '42px',
              maxWidth: '200px',
              marginLeft: '10px',
              textAlign: 'end',
            }}
            onChange={(e) => setValueInputAddres(e.target.value)}
            placeholder="address"
            autoFocus
          />
        </Pane>

        <Button
          disabled={validAddressAddedUser}
          onClick={onClickAddAddressUserToLocalStr}
        >
          Add address
        </Button>
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

  if (stage === STAGE_LEDGER_INIT || stage === STAGE_ADD_ADDRESS_LEDGER) {
    return (
      <ConnectLadger
        onClickConnect={() => getLedgerAddress()}
        connectLedger={connectLedger}
      />
    );
  }

  if (stage === STAGE_ERROR) {
    return (
      <TransactionError
        onClickBtn={() => cleatState()}
        errorMessage="you have this address in your pocket"
      />
    );
  }

  return null;
}

export default ActionBarConnect;
