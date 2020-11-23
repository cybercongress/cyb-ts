import React, { useEffect, useState } from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { Link } from 'react-router-dom';
import { Pane, Input, Text, ActionBar, Button } from '@cybercongress/gravity';
import { CosmosDelegateTool } from '../../utils/ledger';
import { ConnectLadger, Dots, ActionBarContentText } from '../../components';
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

const { STAGE_INIT, STAGE_LEDGER_INIT, HDPATH, LEDGER_OK } = LEDGER;

const STAGE_ADD_ADDRESS_LEDGER = 1.1;
const STAGE_ADD_ADDRESS_USER = 2.1;
const STAGE_ADD_ADDRESS_OK = 2.2;
const LEDGER_TX_ACOUNT_INFO = 2.5;
const STAGE_HDPATH = 1.7;

const ButtonIcon = ({ img, active, disabled, ...props }) => (
  <button
    type="button"
    style={{
      boxShadow: active ? '0 0 5px 2px #36d6ae' : 'none',
      margin: '0 10px',
    }}
    className="container-buttonIcon"
    disabled={disabled}
    {...props}
  >
    <img src={img} alt="img" />
  </button>
);

let ledger = null;

function ActionBarConnect({
  addAddress,
  updateAddress,
  keplr,
  web3,
  accountsETH,
}) {
  const [stage, setStage] = useState(STAGE_INIT);
  const [hdpath, setHDpath] = useState([44, 118, 0, 0, 0]);
  const [connectLedger, setConnectLedger] = useState(null);
  const [valueInputAddres, setValueInputAddres] = useState('');
  const [selectMethod, setSelectMethod] = useState('');
  const [selectNetwork, setSelectNetwork] = useState('');
  const [hdPathError, setHdPathError] = useState(false);
  const [addressLedger, setAddressLedger] = useState(null);

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
        } else {
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
      const addressLedgerCyber = await ledger.retrieveAddressCyber(hdpath);
      const addressLedgerCosmos = await ledger.retrieveAddress(hdpath);
      // if (addressLedger !== null) {
      const accounts = {
        [addressLedgerCyber.bech32]: {
          cyber: addressLedgerCyber,
          cosmos: addressLedgerCosmos,
          keys: 'ledger',
          pk: addressLedgerCyber.pk,
          hdpath,
        },
      };

      const localStorageStory = await localStorage.getItem('pocketAccount');
      if (localStorageStory !== null) {
        const dataPocketAccount = JSON.parse(localStorageStory);
        if (
          !Object.prototype.hasOwnProperty.call(
            dataPocketAccount,
            addressLedgerCyber.bech32
          )
        ) {
          const pocketAccount = { ...accounts, ...dataPocketAccount };
          localStorage.setItem('pocketAccount', JSON.stringify(pocketAccount));
        }
      } else {
        localStorage.setItem('pocketAccount', JSON.stringify(accounts));
      }
      setStage(STAGE_INIT);

      if (updateAddress) {
        updateAddress();
      }
      // }
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
  };

  const onClickAddAddressLedger = async () => {
    setStage(STAGE_ADD_ADDRESS_LEDGER);
    getLedgerAddress();
  };

  const onClickAddAddressUser = () => {
    setStage(STAGE_ADD_ADDRESS_USER);
  };

  const onClickAddAddressUserToLocalStr = async () => {
    let accounts = null;
    let addressLedgerCyber = '';

    if (valueInputAddres.match(PATTERN_COSMOS)) {
      const cyberAddress = fromBech32(
        valueInputAddres,
        CYBER.BECH32_PREFIX_ACC_ADDR_CYBER
      );
      addressLedgerCyber = cyberAddress;
      accounts = {
        [addressLedgerCyber]: {
          cyber: {
            bech32: addressLedgerCyber,
          },
          cosmos: {
            bech32: valueInputAddres,
          },
          keys: 'user',
        },
      };
    }

    if (valueInputAddres.match(PATTERN_CYBER)) {
      const cosmosAddress = fromBech32(valueInputAddres, 'cosmos');
      console.log('cosmosAddress :>> ', cosmosAddress);
      addressLedgerCyber = valueInputAddres;
      const cosmosBech32 = cosmosAddress;
      accounts = {
        [addressLedgerCyber]: {
          cyber: {
            bech32: addressLedgerCyber,
          },
          cosmos: {
            bech32: cosmosBech32,
          },
          keys: 'user',
        },
      };
    }

    if (accounts !== null) {
      setStage(STAGE_ADD_ADDRESS_OK);
      const localStorageStory = await localStorage.getItem('pocketAccount');
      if (localStorageStory !== null) {
        const dataPocketAccount = JSON.parse(localStorageStory);
        if (
          !Object.prototype.hasOwnProperty.call(
            dataPocketAccount,
            addressLedgerCyber
          )
        ) {
          const pocketAccount = { ...accounts, ...dataPocketAccount };
          localStorage.setItem('pocketAccount', JSON.stringify(pocketAccount));
        }
      } else {
        localStorage.setItem('pocketAccount', JSON.stringify(accounts));
      }
    }
    setStage(STAGE_INIT);

    if (updateAddress) {
      updateAddress();
    }
  };

  const onClickConnectWeb3 = async () => {
    if (web3.currentProvider.host) {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.log('You declined transaction', error);
      }
    } else if (window.web3) {
      await web3.eth.getAccounts();
    } else {
      console.log('Your metamask is locked!');
    }
  };

  const connectKeplr = async () => {
    await keplr.enable();

    const address = await keplr.getKeys();
    console.log('address', address);
    const cosmosAddress = fromBech32(address[0].bech32Address, 'cosmos');
    const cyberBech32 = address[0].bech32Address;
    const cosmosBech32 = cosmosAddress;
    const pk = Buffer.from(address[0].pubKey).toString('hex');
    const accounts = {
      [cyberBech32]: {
        cyber: {
          bech32: cyberBech32,
        },
        cosmos: {
          bech32: cosmosBech32,
        },
        keys: 'keplr',
        pk,
      },
    };
    setStage(STAGE_ADD_ADDRESS_OK);
    const localStorageStory = await localStorage.getItem('pocketAccount');
    if (localStorageStory !== null) {
      const dataPocketAccount = JSON.parse(localStorageStory);
      if (
        !Object.prototype.hasOwnProperty.call(dataPocketAccount, cyberBech32)
      ) {
        const pocketAccount = { ...accounts, ...dataPocketAccount };
        localStorage.setItem('pocketAccount', JSON.stringify(pocketAccount));
      }
    } else {
      localStorage.setItem('pocketAccount', JSON.stringify(accounts));
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
      <ActionBar>
        <ActionBarContentText>
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="center"
            flex={1}
          >
            <ButtonIcon
              onClick={() => selectMethodFunc('ledger')}
              active={selectMethod === 'ledger'}
              img={imgLedger}
              text="ledger"
            />
            <ButtonIcon
              onClick={() => selectMethodFunc('keplr')}
              active={selectMethod === 'keplr'}
              img={imgKeplr}
              text="keplr"
            />
            <ButtonIcon
              onClick={() => selectMethodFunc('MetaMask')}
              active={selectMethod === 'MetaMask'}
              img={imgMetaMask}
              text="MetaMask"
            />
            <ButtonIcon
              onClick={() => selectMethodFunc('read-only')}
              active={selectMethod === 'read-only'}
              img={imgRead}
              text="read-only"
            />
          </Pane>
          <span style={{ fontSize: '18px' }}>in</span>
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="center"
            flex={1}
          >
            {selectMethod === 'MetaMask' && (
              <ButtonIcon
                img={imgEth}
                text="ETH"
                onClick={() => selectNetworkFunc('eth')}
                active={selectNetwork === 'eth'}
              />
            )}
            {selectMethod !== 'MetaMask' && (
              <>
                <ButtonIcon
                  img={imgCosmos}
                  text="Cosmos"
                  onClick={() => selectNetworkFunc('cosmos')}
                  active={selectNetwork === 'cosmos'}
                />
                <ButtonIcon
                  onClick={() => selectNetworkFunc('cyber')}
                  active={selectNetwork === 'cyber'}
                  img={imgCyber}
                  text="Cyber"
                />
              </>
            )}
          </Pane>
        </ActionBarContentText>
        <Button disabled={selectNetwork === ''} onClick={() => connctAddress()}>
          connect
        </Button>
      </ActionBar>
    );
  }

  if (stage === STAGE_HDPATH) {
    return (
      <ActionBar>
        <ActionBarContentText>
          <Pane>
            <Pane
              display="flex"
              alignItems="center"
              flex={1}
              justifyContent="center"
            >
              <Text color="#fff" fontSize="20px">
                HD derivation path: {hdpath[0]}/{hdpath[1]}/
              </Text>
              <Input
                value={hdpath[2]}
                onChange={(e) => onChangeAccount(e)}
                width="50px"
                height={42}
                marginLeft={3}
                marginRight={3}
                fontSize="20px"
                textAlign="end"
              />
              <Text color="#fff" fontSize="20px">
                /{hdpath[3]}/
              </Text>
              <Input
                value={hdpath[4]}
                onChange={(e) => onChangeIndex(e)}
                width="50px"
                marginLeft={3}
                height={42}
                fontSize="20px"
                textAlign="end"
              />
            </Pane>
            {addressLedger !== null ? (
              <Pane>{trimString(addressLedger.bech32, 10, 3)}</Pane>
            ) : (
              <Dots />
            )}
          </Pane>
        </ActionBarContentText>
        <Button disabled={hdPathError} onClick={() => addAddressLedger()}>
          Apply
        </Button>
      </ActionBar>
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
          put cosmos or cyber address:
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
          disabled={
            !valueInputAddres.match(PATTERN_COSMOS) &&
            !valueInputAddres.match(PATTERN_CYBER)
          }
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

  return null;
}

export default ActionBarConnect;
