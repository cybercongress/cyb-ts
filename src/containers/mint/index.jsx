import React, { useEffect, useContext, useState } from 'react';
import { Tablist, Pane, Button, Text } from '@cybercongress/gravity';
import { Link, useLocation } from 'react-router-dom';
import Slider from 'rc-slider';
import { coin } from '@cosmjs/launchpad';
import { connect } from 'react-redux';
import { Btn, ItemBalance } from './ui';
import 'rc-slider/assets/index.css';
import {
  trimString,
  formatNumber,
  getDecimal,
  formatCurrencyNumber,
  formatCurrency,
} from '../../utils/utils';
import { authAccounts } from '../../utils/search/utils';
import { CYBER } from '../../utils/config';
import { AppContext } from '../../context';
import ERatio from './eRatio';
import { useGetBalance } from '../account/hooks';
import { Dots, CardStatisics } from '../../components';
import useGetSlots from './useGetSlots';
import TableSlots from './table';
import TabBtnList from './tabLinsBtn';
import ActionBar from './actionBar';

const INIT_STAGE = 0;
const TSX_SEND = 1;

const BASE_VESTING_AMOUNT = 10000000;
const BASE_VESTING_TIME = 86400;
const VESTING_TIME_HOURS = 3600;

const grid = {
  display: 'grid',
  gridTemplateColumns: '250px 1fr 250px',
  gridTemplateRows: 'auto',
  alignItems: 'center',
  margin: '64px 8px 0 8px',
  gridGap: '16px 16px',
  position: 'relative',
  paddingBottom: '150px',
};

const returnColorDot = (marks) => {
  return {
    style: {
      color: '#fff',
      whiteSpace: 'nowrap',
    },
    label: marks,
  };
};

function Mint({ defaultAccount }) {
  const [addressActive, setAddressActive] = useState(null);
  const [updateAddress, setUpdateAddress] = useState(0);
  const { balance } = useGetBalance(addressActive, updateAddress);
  const { slotsData, vested, loadingAuthAccounts } = useGetSlots(
    addressActive,
    updateAddress
  );
  const [selected, setSelected] = useState('volt');
  const [value, setValue] = useState(0);
  const [valueDays, setValueDays] = useState(1);
  const [max, setMax] = useState(1);
  const [eRatio, setERatio] = useState(0);
  const [resourceToken, setResourceToken] = useState(0);

  useEffect(() => {
    const { account } = defaultAccount;
    let addressPocket = null;
    if (
      account !== null &&
      Object.prototype.hasOwnProperty.call(account, 'cyber')
    ) {
      const { keys, bech32 } = account.cyber;
      if (keys === 'keplr') {
        addressPocket = bech32;
      }
    }
    setAddressActive(addressPocket);
  }, [defaultAccount.name]);

  useEffect(() => {
    if (balance.delegation > 0) {
      const maxValue = Math.floor(balance.delegation);
      if (maxValue > 0) {
        setMax(maxValue);
      }
    }
  }, [balance]);

  useEffect(() => {
    if (vested.sboot > 0 && balance.available > 0) {
      const procent = (vested.sboot / balance.available) * 100;
      const eRatioTemp = Math.floor(procent * 100) / 100;
      setERatio(eRatioTemp);
    }
  }, [balance, vested]);

  useEffect(() => {
    const sboot = value;
    const vestingTime = valueDays * VESTING_TIME_HOURS;
    const token = Math.floor(
      (sboot / BASE_VESTING_AMOUNT) * (vestingTime / BASE_VESTING_TIME)
    );
    setResourceToken(token);
  }, [value, valueDays]);

  const updateFunc = () => {
    setUpdateAddress((item) => item + 1);
    setValue(0);
    setValueDays(1);
  };

  return (
    <>
      <main className="block-body" style={{ paddingTop: 30 }}>
        <Pane
          marginTop={30}
          marginBottom={50}
          display="grid"
          gridTemplateColumns="300px 300px 300px"
          gridGap="20px"
          justifyContent="center"
        >
          <CardStatisics title="Amper" value={vested.amper} />
          <CardStatisics title="Volt" value={vested.volt} />
          <CardStatisics title="max slots" value={8} />
        </Pane>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 30,
          }}
        >
          {/* <span style={{ fontSize: '30px', marginBottom: 10 }}>Investmint</span> */}
          <span style={{ fontSize: '18px' }}>
            VERB. to invest tokens for sometime for the right to mint tokens
          </span>
        </div>
        <Tablist
          display="grid"
          gridTemplateColumns="150px 150px"
          gridGap="8px"
          justifyContent="center"
        >
          <Btn
            text="Volt"
            checkedSwitch={selected === 'volt'}
            onSelect={() => setSelected('volt')}
          />
          <Btn
            text="Amper"
            checkedSwitch={selected === 'amper'}
            onSelect={() => setSelected('amper')}
          />
        </Tablist>
        <div style={grid}>
          <div
            style={{
              display: 'grid',
              alignContent: 'space-evenly',
              height: '100%',
            }}
          >
            <ItemBalance text="Liquid balance" amount={balance.available} />
            <ItemBalance
              text="Liquid Stake Investminted"
              amount={loadingAuthAccounts ? null : vested.sboot}
              currency={`S${CYBER.DENOM_CYBER.toUpperCase()}`}
            />
            <ItemBalance
              text="Liquid Stake"
              amount={balance.delegation}
              currency={`S${CYBER.DENOM_CYBER.toUpperCase()}`}
            />
          </div>
          <div
            style={{
              height: '100%',
              display: 'grid',
              gridTemplateRows: '1fr 1fr 1fr',
              width: '100%',
              justifyItems: 'center',
              padding: '0 10px',
            }}
          >
            <Pane fontSize="30px">{resourceToken}</Pane>
            <Slider
              value={value}
              min={0}
              max={max}
              marks={{
                [max]: returnColorDot(`${formatCurrency(max, 'boot')}`),
              }}
              onChange={(eValue) => setValue(eValue)}
              trackStyle={{ backgroundColor: '#3ab793' }}
              railStyle={{ backgroundColor: '#97979775' }}
              dotStyle={{
                backgroundColor: '#97979775',
                borderColor: '#97979775',
              }}
              activeDotStyle={{
                borderColor: '#3ab793',
                backgroundColor: '#3ab793',
              }}
              handleStyle={{
                border: 'none',
                backgroundColor: '#3ab793',
              }}
            />

            <Slider
              value={valueDays}
              min={1}
              max={168}
              marks={{
                1: returnColorDot('1 hour'),
                168: returnColorDot('168 hour'),
              }}
              onChange={(eValue) => setValueDays(eValue)}
              trackStyle={{ backgroundColor: '#3ab793' }}
              railStyle={{ backgroundColor: '#97979775' }}
              dotStyle={{
                backgroundColor: '#97979775',
                borderColor: '#97979775',
              }}
              activeDotStyle={{
                borderColor: '#3ab793',
                backgroundColor: '#3ab793',
              }}
              handleStyle={{
                border: 'none',
                backgroundColor: '#3ab793',
              }}
            />
          </div>
          <div>
            <ERatio eRatio={eRatio} />
          </div>
          {value > 0 && (
            <div
              style={{
                textAlign: 'center',
                gridArea: '2/2/2/2',
                fontSize: '17px',
                position: 'absolute',
                bottom: '30px',
              }}
            >
              You’re minting investing {formatNumber(value)} SBOOT for{' '}
              {valueDays} hour. This operation will mint {resourceToken}{' '}
              {selected} to your account. In the end of period you will be able
              to make your {selected} liquid, but you can use it for boost
              ranking duriung vesintg period
            </div>
          )}
        </div>

        {loadingAuthAccounts ? <Dots big /> : <TableSlots data={slotsData} />}
      </main>
      <ActionBar
        value={value}
        selected={selected}
        valueDays={valueDays}
        resourceToken={resourceToken}
        updateFnc={updateFunc}
        addressActive={addressActive}
      />
    </>
  );
}

const mapStateToProps = (store) => {
  return {
    mobile: store.settings.mobile,
    node: store.ipfs.ipfs,
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(Mint);
