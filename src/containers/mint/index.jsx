import React, { useEffect, useContext, useState } from 'react';
import { Tablist, Pane, Button, Text } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
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
} from '../../utils/utils';
import { authAccounts } from '../../utils/search/utils';
import { CYBER } from '../../utils/config';
import { AppContext } from '../../context';
import ERatio from './eRatio';
import { useGetBalance } from '../account/hooks';
import { Dots } from '../../components';

const INIT_STAGE = 0;
const TSX_SEND = 1;

const BASE_VESTING_AMOUNT = 10000000;
const BASE_VESTING_TIME = 3600;

const grid = {
  display: 'grid',
  gridTemplateColumns: '250px 1fr 250px',
  gridTemplateRows: 'auto',
  alignItems: 'center',
  margin: '64px 8px 0 8px',
  gridGap: '16px 16px',
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
  const { keplr, jsCyber } = useContext(AppContext);
  const [addressActive, setAddressActive] = useState(null);
  const [updateAddress, setUpdateAddress] = useState(0);
  const { balance, loadingBalanceInfo } = useGetBalance(
    addressActive,
    updateAddress
  );
  const [selected, setSelected] = useState('amper');
  const [value, setValue] = useState(0);
  const [valueDays, setValueDays] = useState(1);
  const [max, setMax] = useState(1);
  const [eRatio, setERatio] = useState(0);
  const [vested, setVested] = useState(0);
  const [hashTx, setHashTx] = useState('');
  const [dataVestingPeriods, setDataVestingPeriods] = useState([]);
  const [stage, setStage] = useState(INIT_STAGE);

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
      const maxValue = Math.floor(balance.delegation / BASE_VESTING_AMOUNT);
      if (maxValue > 0) {
        setMax(maxValue);
      }
    }
  }, [balance]);

  useEffect(() => {
    const getAuth = async () => {
      if (keplr !== null && addressActive !== null) {
        const getAccount = await authAccounts(addressActive);
        if (getAccount !== null && getAccount.result.value.vesting_periods) {
          const balances = {};
          if (
            Object.keys(
              getAccount.result.value.base_vesting_account.original_vesting
            ).length > 0
          ) {
            getAccount.result.value.base_vesting_account.original_vesting.forEach(
              (item) => {
                balances[item.denom] = parseFloat(item.amount);
              }
            );
          }
          if (balances.sboot) {
            setVested(balances.sboot);
          }
          // setDataVestingPeriods(getAccount.result.value.vesting_periods);
        }
      }
    };
    getAuth();
  }, [keplr, updateAddress, addressActive]);

  const convert = async () => {
    if (keplr !== null) {
      setStage(TSX_SEND);
      const [{ address }] = await keplr.signer.getAccounts();
      const response = await keplr.investmint(
        address,
        coin(parseFloat(BASE_VESTING_AMOUNT * value), 'sboot'),
        selected,
        parseFloat(BASE_VESTING_TIME * valueDays)
      );
      setHashTx(response.transactionHash);
      setUpdateAddress((item) => item + 1);
      setStage(INIT_STAGE);
      setValue(0);
      setValueDays(1);
    }
  };

  return (
    <main className="block-body" style={{ paddingTop: 30 }}>
      {addressActive === null && (
        <Pane
          boxShadow="0px 0px 5px #36d6ae"
          paddingX={20}
          paddingY={20}
          marginY={20}
        >
          <Text fontSize="16px" color="#fff">
            Start by adding a address to <Link to="/pocket">your pocket</Link>.
          </Text>
        </Pane>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 30,
        }}
      >
        <span style={{ fontSize: '30px', marginBottom: 10 }}>Investmint</span>
        <span style={{ fontSize: '18px' }}>
          VERB. to invest tokens for sometime for the right to mint tokens
        </span>
      </div>
      <Tablist
        display="grid"
        gridTemplateColumns="150px 150px 150px"
        gridGap="8px"
        justifyContent="center"
      >
        <Btn text="Cron" className="disabled-Btn-Mint" />
        <Btn
          text="Amper"
          checkedSwitch={selected === 'amper'}
          onSelect={() => setSelected('amper')}
        />
        <Btn
          text="Volt"
          checkedSwitch={selected === 'volt'}
          onSelect={() => setSelected('volt')}
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
          <ItemBalance text="Vested Balance" amount={vested} />
          <ItemBalance text="Staked balance" amount={balance.delegation} />
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
          <Pane fontSize="30px">{value}</Pane>
          <Slider
            value={value}
            min={0}
            max={max}
            marks={{
              [max / 4]: returnColorDot('25%'),
              [max / 2]: returnColorDot('50%'),
              [max / 1.3333333]: returnColorDot('75%'),
              [max]: returnColorDot('100%'),
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
            }}
          >
            You’re minting investing {formatNumber(value * BASE_VESTING_AMOUNT)}{' '}
            SBOOT for {valueDays} hour. This operation will mint {value}{' '}
            {selected} to your account. In the end of period you will be able to
            make your {selected} liquid, but you can use it for boost ranking
            duriung vesintg period
          </div>
        )}
      </div>
      <div style={{ paddingTop: 50, textAlign: 'center' }}>
        <Button disabled={value === 0} onClick={convert}>
          {stage === INIT_STAGE && 'Submit'}
          {stage === TSX_SEND && <Dots />}
        </Button>
      </div>
      {/* <Pane marginTop={50}>
        {dataVestingPeriods.map((item) => {
          return (
            <Pane display="grid" gridTemplateColumns="1fr 1fr">
              {item.amount.map((itemA) => (
                <Pane>
                  {itemA.amount}
                  {itemA.denom}
                </Pane>
              ))}
            </Pane>
          );
        })}
      </Pane> */}
    </main>
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
