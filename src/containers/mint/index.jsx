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
  convertResources,
} from '../../utils/utils';
import { authAccounts } from '../../utils/search/utils';
import { CYBER } from '../../utils/config';
import { AppContext } from '../../context';
import ERatio from './eRatio';
import { useGetBalance } from '../account/hooks';
import { Dots, CardStatisics, ValueImg } from '../../components';
import useGetSlots from './useGetSlots';
import { TableSlots } from '../energy/ui';
import TabBtnList from './tabLinsBtn';
import ActionBar from './actionBar';

const INIT_STAGE = 0;
const TSX_SEND = 1;

const BASE_VESTING_AMOUNT = 10000000;
const BASE_VESTING_TIME = 86400;
const VESTING_TIME_HOURS = 3600;

const PREFIXES = [
  {
    prefix: 't',
    power: 10 ** 12,
  },
  {
    prefix: 'g',
    power: 10 ** 9,
  },
  {
    prefix: 'm',
    power: 10 ** 6,
  },
  {
    prefix: 'k',
    power: 10 ** 3,
  },
];

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
  const {
    slotsData,
    vested,
    loadingAuthAccounts,
    originalVesting,
  } = useGetSlots(addressActive, updateAddress);
  const [selected, setSelected] = useState('mvolt');
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
    let vestedTokens = 0;
    let maxValue = 0;
    if (originalVesting.hydrogen > 0) {
      vestedTokens =
        parseFloat(originalVesting.hydrogen) - parseFloat(vested.hydrogen);
    }
    if (balance.delegation > 0) {
      maxValue = Math.floor(balance.delegation) - vestedTokens;
    }
    if (maxValue > 0) {
      setMax(maxValue);
    }
  }, [balance, vested, originalVesting]);

  useEffect(() => {
    let vestedTokens = 0;
    if (originalVesting.hydrogen > 0) {
      vestedTokens =
        parseFloat(originalVesting.hydrogen) - parseFloat(vested.hydrogen);
    }
    if (vestedTokens > 0 && balance.delegation > 0) {
      const procent = (vestedTokens / balance.delegation) * 100;
      const eRatioTemp = Math.floor(procent * 100) / 100;
      setERatio(eRatioTemp);
    } else {
      setERatio(0);
    }
  }, [balance, vested, originalVesting]);

  useEffect(() => {
    const hydrogen = value;
    const vestingTime = valueDays * VESTING_TIME_HOURS;
    const token = Math.floor(
      (hydrogen / BASE_VESTING_AMOUNT) * (vestingTime / BASE_VESTING_TIME)
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
      <main className="block-body">
        <Pane
          marginTop={10}
          marginBottom={50}
          display="grid"
          gridTemplateColumns="300px 300px 300px"
          gridGap="20px"
          justifyContent="center"
        >
          <CardStatisics
            title={<ValueImg text="mvolt" />}
            value={formatNumber(originalVesting.mvolt)}
          />
          <CardStatisics
            title={<ValueImg text="mamper" />}
            value={formatNumber(originalVesting.mamper)}
          />
          <CardStatisics
            title="My Energy"
            value={formatCurrency(
              originalVesting.mamper * originalVesting.mvolt,
              'W',
              2,
              PREFIXES
            )}
          />
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
            text={<ValueImg text="mvolt" />}
            checkedSwitch={selected === 'mvolt'}
            onSelect={() => setSelected('mvolt')}
          />
          <Btn
            text={<ValueImg text="mamper" />}
            checkedSwitch={selected === 'mamper'}
            onSelect={() => setSelected('mamper')}
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
            {/* <ItemBalance text="Liquid balance" amount={balance.available} /> */}
            <ItemBalance
              text="Liquid"
              amount={balance.delegation}
              currency={<ValueImg text="hydrogen" />}
            />
            <ItemBalance
              text="Frozen"
              amount={loadingAuthAccounts ? null : originalVesting.hydrogen}
              currency={<ValueImg text="hydrogen" />}
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
                [max]: returnColorDot(`${formatNumber(max)} H`),
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
              You’re freezing {formatNumber(value)} H for {valueDays} hours. It
              will release {resourceToken} {<ValueImg text={selected} />} for
              you. At the end of the period, {selected} becomes liquid
              automatically, but you can use it to boost ranking during the
              freeze. You can have only 8 slots for investmint at a time.
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
