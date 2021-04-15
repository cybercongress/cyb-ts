import React, { useEffect, useContext, useState } from 'react';
import { Tablist, Pane, Button } from '@cybercongress/gravity';
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
import { AppContext } from '../../context';
import ERatio from './eRatio';

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
  const [selected, setSelected] = useState('amper');
  const [value, setValue] = useState(0);
  const [valueDays, setValueDays] = useState(1);
  const [max, setMax] = useState(1000);
  const [addressActive, setAddressActive] = useState(null);
  const [valueNick, setValueNick] = useState(0);
  const [eRatio, setERatio] = useState(50);
  const [hashTx, setHashTx] = useState('');

  // console.log(`keplr`, keplr);
  // console.log(`jsCyber`, jsCyber);

  useEffect(() => {
    const { account } = defaultAccount;
    let addressPocket = null;
    if (
      account !== null &&
      Object.prototype.hasOwnProperty.call(account, 'cyber')
    ) {
      const { keys, bech32 } = account.cyber;
      if (keys === 'keplr') {
        addressPocket = {
          bech32,
          keys,
        };
      }
    }
    setAddressActive(addressPocket);
  }, [defaultAccount.name]);

  const convert = async () => {
    if (keplr !== null) {
      const firstAddress = (await keplr.signer.getAccounts())[0].address;
      const response = await keplr.convertResources(
        firstAddress,
        coin(parseFloat(valueNick), 'nick'),
        selected,
        parseFloat(valueDays)
      );
      setHashTx(response.transactionHash);
    }
  };

  useEffect(() => {
    const getBalance = async () => {
      if (jsCyber !== null && addressActive !== null) {
        const queryResultgetAllBalancesUnverified = await jsCyber.getAllBalancesUnverified(
          addressActive.bech32
        );
        const responceauth = await jsCyber.queryClient.auth.account(
          addressActive.bech32
        );
        console.log(`responceauth`, responceauth)
        const responceDistributionDelegatorValidators = await jsCyber.queryClient.distribution.delegatorValidators(
          addressActive.bech32
        );
        console.log(
          `responceDistributionDelegatorValidators`,
          responceDistributionDelegatorValidators
        );
        const responceDelegationTotalRewards = await jsCyber.queryClient.distribution.delegationTotalRewards(
          addressActive.bech32
        );
        console.log(
          `responceDistributionDelegatorValidators`,
          responceDelegationTotalRewards
        );
        console.log(
          `queryResultgetAllBalancesUnverified`,
          queryResultgetAllBalancesUnverified
        );
        const balances = {};
        if (Object.keys(queryResultgetAllBalancesUnverified).length > 0) {
          queryResultgetAllBalancesUnverified.forEach((item) => {
            balances[item.denom] = parseFloat(item.amount);
          });
        }
      }
    };
    getBalance();
  }, [jsCyber, addressActive]);

  return (
    <main className="block-body" style={{ paddingTop: 30 }}>
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
          <ItemBalance text="Liquid balance" amount={500000000} />
          <ItemBalance text="Vested Balance" amount={50500000} />
          <ItemBalance text="Staked balance" amount={0} />
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
            max={90}
            marks={{
              1: returnColorDot('1 day'),
              90: returnColorDot('90 days'),
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
            You’re minting investing 100 NICK for {valueDays} days. This
            operation will mint {value} {selected} to your account. In the end
            of period you will be able to make your {selected} liquid, but you
            can use it for boost ranking duriung vesintg period
          </div>
        )}
      </div>
      <div style={{ paddingTop: 50, textAlign: 'center' }}>
        <Button disabled={value === 0} onClick={convert}>
          Submit
        </Button>
      </div>
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
