import React, { useEffect, useState } from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { Link } from 'react-router-dom';
import { Pane, Text, ActionBar, Button } from '@cybercongress/gravity';
import { CosmosDelegateTool } from '../../utils/ledger';
import { ConnectLadger, Dots } from '../../components';
import {
  LEDGER,
  CYBER,
  PATTERN_COSMOS,
  PATTERN_CYBER,
  POCKET,
} from '../../utils/config';
import { fromBech32 } from '../../utils/utils';

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

const ButtonIcon = ({ img, active, disabled, ...props }) => (
  <button
    type="button"
    style={{ boxShadow: active ? '0 0 5px 2px #36d6ae' : 'none' }}
    className="container-buttonIcon"
    disabled={disabled}
    {...props}
  >
    <img src={img} alt="img" />
  </button>
);

let ledger = null;

function ActionBarConnect({ addAddress, updateAddress, keplr }) {
  const [stage, setStage] = useState(STAGE_INIT);
  const [connectLedger, setConnectLedger] = useState(null);
  const [valueInputAddres, setValueInputAddres] = useState('');
  const [selectMethod, setSelectMethod] = useState('');

  useEffect(() => {
    if (addAddress === false && stage === STAGE_ADD_ADDRESS_OK) {
      cleatState();
    }
  }, [stage, addAddress]);

  const getLedgerAddress = async () => {
    const transport = await TransportWebUSB.create(120 * 1000);
    ledger = new CosmosDelegateTool(transport);

    const connect = await ledger.connect();
    if (connect.return_code === LEDGER_OK) {
      if (stage === STAGE_ADD_ADDRESS_LEDGER) {
        addAddressLedger();
      }
      setConnectLedger(true);
    } else {
      setConnectLedger(false);
    }
  };

  const addAddressLedger = async () => {
    try {
      setStage(STAGE_ADD_ADDRESS_OK);
      const addressLedgerCyber = await ledger.retrieveAddressCyber(HDPATH);
      const addressLedgerCosmos = await ledger.retrieveAddress(HDPATH);

      const accounts = {
        [addressLedgerCyber.bech32]: {
          cyber: addressLedgerCyber,
          cosmos: addressLedgerCosmos,
          keys: 'ledger',
          pk: addressLedgerCyber.pk,
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
    } catch (error) {
      const { message, statusCode } = error;
      if (message !== "Cannot read property 'length' of undefined") {
        // this just means we haven't found the device yet...
        // eslint-disable-next-line
        console.error('Problem reading address data', message, statusCode);
      }
    }
  };

  const onClickInitLedger = () => {
    setStage(STAGE_LEDGER_INIT);
    getLedgerAddress();
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

  const connectKeplr = async () => {
    await keplr.enable();

    const address = await keplr.getKeys();
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
  // const { keplr, brain, accountKeplr } = props;
  // const { stage, connectLedger, valueInputAddres } = state;

  console.log('stage', stage);

  if (stage === STAGE_INIT) {
    return (
      <ActionBar>
        <Pane
          width="100%"
          display="grid"
          gridTemplateColumns="1fr 1fr 1fr"
          alignItems="center"
          justifyItems="center"
        >
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="space-around"
            width="100%"
          >
            <ButtonIcon
              onClick={() => setSelectMethod('ledger')}
              active={selectMethod === 'ledger'}
              img={imgLedger}
              text="ledger"
            />
            <ButtonIcon
              onClick={() => setSelectMethod('keplr')}
              active={selectMethod === 'keplr'}
              img={imgKeplr}
              text="keplr"
            />
            <ButtonIcon
              onClick={() => setSelectMethod('MetaMask')}
              active={selectMethod === 'MetaMask'}
              img={imgMetaMask}
              text="MetaMask"
            />
            <ButtonIcon
              onClick={() => setSelectMethod('read-only')}
              active={selectMethod === 'read-only'}
              img={imgRead}
              text="read-only"
            />
          </Pane>
          <span style={{ fontSize: '18px' }}>in</span>
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="space-around"
            width="100%"
          >
            <ButtonIcon
              disabled={selectMethod !== 'MetaMask'}
              img={imgEth}
              text="ETH"
            />
            <ButtonIcon
              onClick={
                // eslint-disable-next-line no-nested-ternary
                selectMethod === 'ledger'
                  ? onClickAddAddressLedger
                  : selectMethod === 'keplr'
                  ? connectKeplr
                  : onClickAddAddressUser
              }
              img={imgCosmos}
              text="Cosmos"
            />
            <ButtonIcon
              onClick={
                // eslint-disable-next-line no-nested-ternary
                selectMethod === 'ledger'
                  ? onClickAddAddressLedger
                  : selectMethod === 'keplr'
                  ? connectKeplr
                  : onClickAddAddressUser
              }
              img={imgCyber}
              text="Cyber"
            />
          </Pane>

          {/* imgLedger
          imgKeplr
          imgMetaMask
          imgEth
          imgCyber
          imgCosmos */}
          {/* {!brain && (
              <Button marginX="10px" onClick={onClickAddAddressUser}>
                Put a read-only address
              </Button>
            )}
            <Button marginX="10px" onClick={onClickAddAddressLedger}>
              Connect your Ledger
            </Button>
            {keplr && (
              <Button marginX="10px" onClick={connectKeplr}>
                Connect Keplr
              </Button>
            )} */}
        </Pane>
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
