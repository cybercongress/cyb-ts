import React, { useEffect, useState } from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { Link } from 'react-router-dom';
import { Pane, Input, Text, ActionBar, Button } from '@cybercongress/gravity';
import { CosmosDelegateTool } from '../../utils/ledger';
import {
  ConnectLadger,
  Dots,
  ActionBarContentText,
  ConnectAddress,
  SetHdpath,
  TransactionError,
} from '../../components';
import {
  LEDGER,
  CYBER,
  PATTERN_COSMOS,
  PATTERN_CYBER,
  POCKET,
} from '../../utils/config';
import { fromBech32, trimString } from '../../utils/utils';

const imgLedger = require('../../image/ledger.svg');
const imgKeplr = require('../../image/keplr-icon.svg');
const imgMetaMask = require('../../image/mm-logo.svg');
const imgRead = require('../../image/duplicate-outline.svg');
const imgEth = require('../../image/Ethereum_logo_2014.svg');
const imgCyber = require('../../image/cyber.png');
const imgCosmos = require('../../image/cosmos-2.svg');

const { DIVISOR_CYBER_G } = CYBER;

const {
  STAGE_INIT,
  STAGE_LEDGER_INIT,
  HDPATH,
  LEDGER_OK,
  STAGE_ERROR,
} = LEDGER;

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

let ledger = null;

function ActionBarConnect({
  addAddress,
  updateAddress,
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

console.log('selectAccount', selectAccount);

  useEffect(() => {
    if (addAddress === false && stage === STAGE_ADD_ADDRESS_OK) {
      cleatState();
    }
  }, [stage, addAddress]);

  useEffect(() => {
    const feachData = async () => {
      if (parseInt(hdpath[2], 10) >= 0 && parseInt(hdpath[4], 10) >= 0) {
        setHdPathError(false);
        setAddressLedger(null);
        let retrieveAddress = null;
        if (selectNetwork === 'cyber') {
          retrieveAddress = await ledger.retrieveAddressCyber(hdpath);
        }
        if (selectNetwork === 'cosmos') {
          retrieveAddress = await ledger.retrieveAddress(hdpath);
        }
        setAddressLedger(retrieveAddress);
      } else {
        setAddressLedger(null);
        setHdPathError(true);
      }
    };
    feachData();
  }, [hdpath]);

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
      case 'ledger':
        onClickAddAddressLedger();
        break;

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

  const getLedgerAddress = async () => {
    const transport = await TransportWebUSB.create(120 * 1000);
    ledger = new CosmosDelegateTool(transport);

    const connect = await ledger.connect();
    if (connect.return_code === LEDGER_OK) {
      let retrieveAddress = null;
      if (selectNetwork === 'cyber') {
        retrieveAddress = await ledger.retrieveAddressCyber(hdpath);
      } else {
        retrieveAddress = await ledger.retrieveAddress(hdpath);
      }
      setAddressLedger(retrieveAddress);
      setConnectLedger(true);
      setStage(STAGE_HDPATH);
    } else {
      setConnectLedger(false);
    }
  };

  const addAddressLedger = async () => {
    try {
      setStage(STAGE_ADD_ADDRESS_OK);
      const accounts = {};
      let key = 'Account 1';
      let dataPocketAccount = null;
      let pocketAccount = {};
      let valueObj = {};

      const localStorageStory = await localStorage.getItem('pocketAccount');
      if (localStorageStory !== null) {
        dataPocketAccount = JSON.parse(localStorageStory);
        valueObj = Object.values(dataPocketAccount);
        const dataLength = Object.keys(dataPocketAccount).length;
        key = `Account ${dataLength + 1}`;
      }
      if (selectNetwork === 'cyber' || addCyberAddress) {
        const addressLedgerCyber = await ledger.retrieveAddressCyber(hdpath);
        if (!checkAddress(valueObj, 'cyber', addressLedgerCyber.bech32)) {
          accounts.cyber = { ...addressLedgerCyber, keys: 'ledger' };
        }
      }
      if (selectNetwork === 'cosmos') {
        const addressLedgerCosmos = await ledger.retrieveAddress(hdpath);
        if (!checkAddress(valueObj, 'cosmos', addressLedgerCosmos.bech32)) {
          accounts.cosmos = { ...addressLedgerCosmos, keys: 'ledger' };
        }
      }
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
      setStage(STAGE_INIT);

      if (updateAddress) {
        updateAddress();
      }
    } catch (error) {
      const { message, statusCode } = error;
      if (message !== "Cannot read property 'length' of undefined") {
        // this just means we haven't found the device yet...
        // eslint-disable-next-line
        console.error('Problem reading address data', message, statusCode);
      }
    }
  };

  const cleatState = () => {
    setStage(STAGE_INIT);
    setValueInputAddres('');
    ledger = null;
    setHDpath(HDPATH);
    setConnectLedger(null);
    setSelectMethod('');
    setSelectNetwork('');
    setHdPathError(false);
    setAddressLedger(null);
    setAddCyberAddress(false);
    setValidAddressAddedUser(true);
  };

  const onClickAddAddressLedger = async () => {
    setStage(STAGE_ADD_ADDRESS_LEDGER);
    getLedgerAddress();
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

    const localStorageStory = await localStorage.getItem('pocketAccount');
    if (localStorageStory !== null) {
      dataPocketAccount = JSON.parse(localStorageStory);
      valueObj = Object.values(dataPocketAccount);
      const dataLength = Object.keys(dataPocketAccount).length;
      key = `Account ${dataLength + 1}`;
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
      if (!checkAddress(valueObj, 'cyber', cyberAddress)) {
        accounts.cyber = { bech32: cyberAddress, keys: 'read-only' };
      }
    }
    if (selectNetwork === 'cosmos') {
      const cosmosAddress = valueInputAddres;
      if (!checkAddress(valueObj, 'cosmos', cosmosAddress)) {
        accounts.cosmos = { bech32: cosmosAddress, keys: 'read-only' };
      }
    }

    setStage(STAGE_ADD_ADDRESS_OK);
    if (localStorageStory !== null) {
      if (Object.keys(accounts).length > 0) {
        pocketAccount = { [key]: accounts, ...dataPocketAccount };
      }
    } else {
      pocketAccount = { [key]: accounts };
    }

    if (Object.keys(pocketAccount).length > 0) {
      localStorage.setItem('pocketAccount', JSON.stringify(pocketAccount));
      setStage(STAGE_INIT);
      if (updateAddress) {
        updateAddress();
      }
    } else {
      setStage(STAGE_ERROR);
    }
  };

  const onClickConnectWeb3 = async () => {
    const accounts = {};
    let key = 'Account 1';
    let dataPocketAccount = null;
    let pocketAccount = {};

    const localStorageStory = await localStorage.getItem('pocketAccount');
    if (localStorageStory !== null) {
      dataPocketAccount = JSON.parse(localStorageStory);
      const dataLength = Object.keys(dataPocketAccount).length;
      key = `Account ${dataLength + 1}`;
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
      setStage(STAGE_INIT);

      if (updateAddress) {
        updateAddress();
      }
    }
  };

  const connectKeplr = async () => {
    const accounts = {};
    let key = 'Account 1';
    let dataPocketAccount = null;
    let valueObj = {};
    let pocketAccount = {};
    await keplr.enable();

    const address = await keplr.getKeys();
    const pk = Buffer.from(address[0].pubKey).toString('hex');

    const localStorageStory = await localStorage.getItem('pocketAccount');
    if (localStorageStory !== null) {
      dataPocketAccount = JSON.parse(localStorageStory);
      valueObj = Object.values(dataPocketAccount);
      const dataLength = Object.keys(dataPocketAccount).length;
      key = `Account ${dataLength + 1}`;
    }
    if (selectNetwork === 'cyber' || addCyberAddress) {
      const cyberBech32 = address[0].bech32Address;
      if (!checkAddress(valueObj, 'cyber', cyberBech32)) {
        accounts.cyber = {
          bech32: cyberBech32,
          keys: 'keplr',
          pk,
          path: HDPATH,
        };
      }
    }
    if (selectNetwork === 'cosmos') {
      const cosmosAddress = fromBech32(address[0].bech32Address, 'cosmos');
      const cosmosBech32 = cosmosAddress;
      if (!checkAddress(valueObj, 'cosmos', cosmosBech32)) {
        accounts.cosmos = {
          bech32: cosmosBech32,
          keys: 'keplr',
          pk,
          path: HDPATH,
        };
      }
    }
    setStage(STAGE_ADD_ADDRESS_OK);
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
    setStage(STAGE_INIT);

    if (updateAddress) {
      updateAddress();
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
      />
    );
  }

  if (stage === STAGE_HDPATH) {
    return (
      <SetHdpath
        hdpath={hdpath}
        onChangeAccount={onChangeAccount}
        onChangeIndex={onChangeIndex}
        addressLedger={addressLedger}
        hdPathError={hdPathError}
        addAddressLedger={addAddressLedger}
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
