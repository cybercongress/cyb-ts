import React, { useEffect, useState, useContext } from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { Link } from 'react-router-dom';
import { Pane, Input, Text, ActionBar, Button } from '@cybercongress/gravity';
import { connect } from 'react-redux';
import { CosmosDelegateTool } from '../../utils/ledger';
import {
  ConnectLadger,
  Dots,
  ActionBarContentText,
  SetHdpath,
  TransactionError,
  ButtonIcon,
} from '../../components';
import {
  LEDGER,
  CYBER,
  PATTERN_COSMOS,
  PATTERN_CYBER,
  POCKET,
} from '../../utils/config';
import { fromBech32, trimString } from '../../utils/utils';
import { AppContext } from '../../context';
import { setDefaultAccount, setAccounts } from '../../redux/actions/pocket';

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

const imgLedger = require('../../image/ledger.svg');
const imgKeplr = require('../../image/keplr-icon.svg');
const imgMetaMask = require('../../image/mm-logo.svg');
const imgRead = require('../../image/duplicate-outline.svg');
const imgEth = require('../../image/Ethereum_logo_2014.svg');
const imgCyber = require('../../image/blue-circle.png');

const checkAddress = (obj, network, address) =>
  Object.keys(obj).some((k) => {
    if (obj[k][network]) {
      return obj[k][network].bech32 === address;
    }
  });

  
export const ConnectAddress = ({
  selectMethodFunc,
  selectMethod,
  selectNetwork,
  connctAddress,
  web3,
  keplr,
}) => {
  return (
    <ActionBar>
      <ActionBarContentText>
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          flex={1}
        >
          {selectNetwork === 'cyber' && (
            <>
              <ButtonIcon
                onClick={() => selectMethodFunc('ledger')}
                active={selectMethod === 'ledger'}
                img={imgLedger}
                text="ledger"
              />
              {keplr && (
                <ButtonIcon
                  onClick={() => selectMethodFunc('keplr')}
                  active={selectMethod === 'keplr'}
                  img={imgKeplr}
                  text="keplr"
                />
              )}
            </>
          )}
          {web3 && web3 !== null && selectNetwork === 'eth' && (
            <ButtonIcon
              onClick={() => selectMethodFunc('MetaMask')}
              active={selectMethod === 'MetaMask'}
              img={imgMetaMask}
              text="metaMask"
            />
          )}
          {selectNetwork === 'cyber' && (
            <ButtonIcon
              onClick={() => selectMethodFunc('read-only')}
              active={selectMethod === 'read-only'}
              img={imgRead}
              text="read-only"
            />
          )}
        </Pane>
        <span style={{ fontSize: '18px' }}>in</span>
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          flex={1}
        >
          {selectNetwork === 'eth' && (
            <ButtonIcon img={imgEth} text="eth" active />
          )}
          {selectNetwork === 'cyber' && (
            <ButtonIcon active img={imgCyber} text="cyber" />
          )}
        </Pane>
      </ActionBarContentText>
      <Button
        disabled={selectNetwork === '' || selectMethod === ''}
        onClick={() => connctAddress()}
      >
        connect
      </Button>
    </ActionBar>
  );
};

let ledger = null;

function ActionBarConnect({
  selectNetwork = '',
  web3,
  defaultAccount,
  setAccountsProps,
  setDefaultAccountProps,
}) {
  const { keplr } = useContext(AppContext);
  const [stage, setStage] = useState(STAGE_INIT);
  const [hdpath, setHDpath] = useState([44, 118, 0, 0, 0]);
  const [connectLedger, setConnectLedger] = useState(null);
  const [valueInputAddres, setValueInputAddres] = useState('');
  const [selectMethod, setSelectMethod] = useState('');
  const [hdPathError, setHdPathError] = useState(false);
  const [addressLedger, setAddressLedger] = useState(null);
  const [addCyberAddress, setAddCyberAddress] = useState(false);
  const [validAddressAddedUser, setValidAddressAddedUser] = useState(true);

  useEffect(() => {
    if (selectNetwork === 'cyber') {
      setSelectMethod('ledger');
    } else {
      setSelectMethod('MetaMask');
    }
  }, [selectNetwork]);

  useEffect(() => {
    const feachData = async () => {
      if (
        stage === STAGE_HDPATH &&
        parseInt(hdpath[2], 10) >= 0 &&
        parseInt(hdpath[4], 10) >= 0
      ) {
        setHdPathError(false);
        setAddressLedger(null);
        let retrieveAddress = null;
        if (selectNetwork === 'cyber') {
          retrieveAddress = await ledger.retrieveAddressCyber(hdpath);
        }
        setAddressLedger(retrieveAddress);
      } else {
        setAddressLedger(null);
        setHdPathError(true);
      }
    };
    feachData();
  }, [hdpath, stage]);

  useEffect(() => {
    if (selectNetwork === 'cyber') {
      if (valueInputAddres.match(PATTERN_CYBER)) {
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

    const ledgerApp = await ledger.connect();
    if (ledgerApp.return_code === LEDGER_OK) {
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
    setStage(STAGE_ADD_ADDRESS_OK);
    const accounts = {};
    let key = 'Account 1';
    let dataPocketAccount = null;
    let pocketAccount = {};
    let valueObj = {};
    let count = 1;

    const localStorageStory = await localStorage.getItem('pocketAccount');
    const localStoragePocket = await localStorage.getItem('pocket');

    if (defaultAccount.name === null) {
      const localStorageCount = await localStorage.getItem('count');
      if (localStorageCount !== null) {
        const dataCount = JSON.parse(localStorageCount);
        count = parseFloat(dataCount);
        key = `Account ${count}`;
      }
      localStorage.setItem('count', JSON.stringify(count + 1));
    }
    if (localStorageStory !== null) {
      dataPocketAccount = JSON.parse(localStorageStory);
      valueObj = Object.values(dataPocketAccount);
      if (defaultAccount.name !== null) {
        key = defaultAccount.name;
      }
    }
    if (selectNetwork === 'cyber' || addCyberAddress) {
      const addressLedgerCyber = await ledger.retrieveAddressCyber(hdpath);
      if (
        defaultAccount.name !== null ||
        !checkAddress(valueObj, 'cyber', addressLedgerCyber.bech32)
      ) {
        accounts.cyber = { ...addressLedgerCyber, keys: 'ledger' };
      }
    }
    setStage(STAGE_ADD_ADDRESS_OK);
    if (defaultAccount.name === null) {
      if (localStorageStory !== null) {
        if (Object.keys(accounts).length > 0) {
          pocketAccount = { [key]: accounts, ...dataPocketAccount };
        }
      } else {
        pocketAccount = { [key]: accounts };
      }
      if (Object.keys(pocketAccount).length > 0) {
        localStorage.setItem('pocketAccount', JSON.stringify(pocketAccount));
        setAccountsProps(pocketAccount);
      }
    } else {
      dataPocketAccount[defaultAccount.name][selectNetwork] =
        accounts[selectNetwork];
      if (Object.keys(dataPocketAccount).length > 0) {
        localStorage.setItem(
          'pocketAccount',
          JSON.stringify(dataPocketAccount)
        );
        setAccountsProps(dataPocketAccount);
      }
      if (localStoragePocket !== null) {
        const localStoragePocketData = JSON.parse(localStoragePocket);
        const keyPocket = Object.keys(localStoragePocketData)[0];
        localStoragePocketData[keyPocket][selectNetwork] =
          accounts[selectNetwork];
        if (keyPocket === defaultAccount.name) {
          localStorage.setItem(
            'pocket',
            JSON.stringify(localStoragePocketData)
          );
          setDefaultAccountProps(keyPocket, localStoragePocketData[keyPocket]);
        }
      }
    }
    cleatState();
  };

  const cleatState = () => {
    setStage(STAGE_INIT);
    setValueInputAddres('');
    ledger = null;
    setHDpath(HDPATH);
    setConnectLedger(null);
    setSelectMethod('');
    // setSelectNetwork('');
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
      if (defaultAccount.name !== null) {
        key = defaultAccount.name;
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
        defaultAccount.name !== null ||
        !checkAddress(valueObj, 'cyber', cyberAddress)
      ) {
        accounts.cyber = { bech32: cyberAddress, keys: 'read-only' };
      }
    }

    setStage(STAGE_ADD_ADDRESS_OK);
    if (defaultAccount.name === null) {
      if (localStorageStory !== null) {
        if (Object.keys(accounts).length > 0) {
          pocketAccount = { [key]: accounts, ...dataPocketAccount };
        }
      } else {
        pocketAccount = { [key]: accounts };
      }

      if (Object.keys(pocketAccount).length > 0) {
        localStorage.setItem('pocketAccount', JSON.stringify(pocketAccount));
        setAccountsProps(pocketAccount);
        cleatState();
      } else {
        setStage(STAGE_ERROR);
      }
    } else {
      dataPocketAccount[defaultAccount.name][selectNetwork] =
        accounts[selectNetwork];
      if (Object.keys(dataPocketAccount).length > 0) {
        localStorage.setItem(
          'pocketAccount',
          JSON.stringify(dataPocketAccount)
        );
        setAccountsProps(dataPocketAccount);
      }
      if (localStoragePocket !== null) {
        const localStoragePocketData = JSON.parse(localStoragePocket);
        const keyPocket = Object.keys(localStoragePocketData)[0];
        localStoragePocketData[keyPocket][selectNetwork] =
          accounts[selectNetwork];
        if (keyPocket === defaultAccount.name) {
          localStorage.setItem(
            'pocket',
            JSON.stringify(localStoragePocketData)
          );
          setDefaultAccountProps(keyPocket, localStoragePocketData[keyPocket]);
        }
      }
      cleatState();
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
      if (defaultAccount.name !== null) {
        key = defaultAccount.name;
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
      if (defaultAccount.name === null) {
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
          setAccountsProps(pocketAccount);
        }
      } else {
        dataPocketAccount[defaultAccount.name][selectNetwork] =
          accounts[selectNetwork];
        if (Object.keys(dataPocketAccount).length > 0) {
          localStorage.setItem(
            'pocketAccount',
            JSON.stringify(dataPocketAccount)
          );
          setAccountsProps(dataPocketAccount);
        }
        if (localStoragePocket !== null) {
          const localStoragePocketData = JSON.parse(localStoragePocket);
          const keyPocket = Object.keys(localStoragePocketData)[0];
          localStoragePocketData[keyPocket][selectNetwork] =
            accounts[selectNetwork];
          if (keyPocket === defaultAccount.name) {
            localStorage.setItem(
              'pocket',
              JSON.stringify(localStoragePocketData)
            );
            setDefaultAccountProps(
              keyPocket,
              localStoragePocketData[keyPocket]
            );
          }
        }
      }
      cleatState();
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

    const { address, pubkey } = await keplr.getAccount();
    const pk = Buffer.from(pubkey.value).toString('hex');

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
      if (defaultAccount.name !== null) {
        key = defaultAccount.name;
      }
    }
    if (selectNetwork === 'cyber' || addCyberAddress) {
      const cyberBech32 = address;
      if (
        defaultAccount.name !== null ||
        !checkAddress(valueObj, 'cyber', cyberBech32)
      ) {
        accounts.cyber = {
          bech32: cyberBech32,
          keys: 'keplr',
          pk,
          path: HDPATH,
        };
      }
    }

    setStage(STAGE_ADD_ADDRESS_OK);
    if (defaultAccount.name === null) {
      if (localStorageStory !== null) {
        if (Object.keys(accounts).length > 0) {
          pocketAccount = { [key]: accounts, ...dataPocketAccount };
        }
      } else {
        pocketAccount = { [key]: accounts };
      }
      if (Object.keys(pocketAccount).length > 0) {
        localStorage.setItem('pocketAccount', JSON.stringify(pocketAccount));
        setAccountsProps(pocketAccount);
      }
    } else {
      dataPocketAccount[defaultAccount.name][selectNetwork] =
        accounts[selectNetwork];
      console.log('dataPocketAccount', dataPocketAccount);
      if (Object.keys(dataPocketAccount).length > 0) {
        localStorage.setItem(
          'pocketAccount',
          JSON.stringify(dataPocketAccount)
        );
        setAccountsProps(dataPocketAccount);
      }
      if (localStoragePocket !== null) {
        const localStoragePocketData = JSON.parse(localStoragePocket);
        const keyPocket = Object.keys(localStoragePocketData)[0];
        localStoragePocketData[keyPocket][selectNetwork] =
          accounts[selectNetwork];
        if (keyPocket === defaultAccount.name) {
          localStorage.setItem(
            'pocket',
            JSON.stringify(localStoragePocketData)
          );
          setDefaultAccountProps(keyPocket, localStoragePocketData[keyPocket]);
        }
      }
    }
    cleatState();
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
    // setSelectNetwork('');
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
        web3={web3}
        // selectAccount={selectAccount}
        keplr={keplr}
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

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

const mapDispatchprops = (dispatch) => {
  return {
    setDefaultAccountProps: (name, account) =>
      dispatch(setDefaultAccount(name, account)),
    setAccountsProps: (accounts) => dispatch(setAccounts(accounts)),
  };
};

export default connect(mapStateToProps, mapDispatchprops)(ActionBarConnect);
