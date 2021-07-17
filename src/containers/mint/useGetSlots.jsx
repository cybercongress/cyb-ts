import { useEffect, useState } from 'react';
import { authAccounts } from '../../utils/search/utils';

const MILLISECONDS_IN_SECOND = 1000;

const initStateVested = {
  sboot: 0,
  volt: 0,
  amper: 0,
};

function timeSince(timeMS) {
  const seconds = Math.floor(timeMS / 1000);

  if (seconds === 0) {
    return 'now';
  }

  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return `${interval} years`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return `${interval} months`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return `${interval} days`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return `${interval} hours`;
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return `${interval} minutes`;
  }
  return `${Math.floor(seconds)} seconds`;
}

function useGetSlots(addressActive, updateAddress) {
  const [slotsData, setSlotsData] = useState([]);
  const [loadingAuthAccounts, setLoadingAuthAccounts] = useState(true);
  const [vested, setVested] = useState(initStateVested);

  useEffect(() => {
    const getAuth = async () => {
      setLoadingAuthAccounts(true);
      setVested(initStateVested);
      setSlotsData([]);
      if (addressActive !== null) {
        const vestedAmount = {
          sboot: 0,
          volt: 0,
          amper: 0,
        };

        const getAccount = await authAccounts(addressActive);
        console.log(`getAccount`, getAccount);
        if (getAccount !== null && getAccount.result.value.vesting_periods) {
          const { vesting_periods: vestingPeriods } = getAccount.result.value;
          const {
            original_vesting: originalVesting,
          } = getAccount.result.value.base_vesting_account;
          const { start_time: startTime } = getAccount.result.value;

          const balances = getCalculationBalance(originalVesting);
          if (balances.sboot) {
            vestedAmount.sboot = balances.sboot;
          }
          if (balances.volt) {
            vestedAmount.volt = balances.volt;
          }
          if (balances.amper) {
            vestedAmount.amper = balances.amper;
          }
          setVested(vestedAmount);

          const dataVesting = getVestingPeriodsData(vestingPeriods, startTime);
          setSlotsData(dataVesting);
          setLoadingAuthAccounts(false);
        } else {
          setVested(initStateVested);
          setLoadingAuthAccounts(false);
          setSlotsData([]);
        }
      } else {
        setVested(initStateVested);
        setLoadingAuthAccounts(false);
        setSlotsData([]);
      }
    };
    getAuth();
  }, [updateAddress, addressActive]);

  const getCalculationBalance = (data) => {
    const balances = {};
    if (Object.keys(data).length > 0) {
      data.forEach((item) => {
        balances[item.denom] = parseFloat(item.amount);
      });
    }

    return balances;
  };

  const getVestingPeriodsData = (data, startTime) => {
    const tempData = [];
    let length = parseFloat(startTime);

    if (data.length > 0) {
      data.forEach((item) => {
        const obj = {};
        length += parseFloat(item.length);
        const lengthMs = length * MILLISECONDS_IN_SECOND;
        obj.length = length * MILLISECONDS_IN_SECOND;
        const d = new Date();
        if (lengthMs < Date.parse(d)) {
          const time = Date.parse(d) - lengthMs;
          obj.status = `${timeSince(time)} more`;
        } else {
          obj.status = 'available';
        }
        // obj.status = 'empty';
        item.amount.forEach((itemAmount) => {
          const amount = {};
          amount[itemAmount.denom] = parseFloat(itemAmount.amount);
          if (obj.amount) {
            obj.amount = { ...obj.amount, ...amount };
          } else {
            obj.amount = amount;
          }
        });
        tempData.push(obj);
      });
    }
    return tempData;
  };

  return { slotsData, vested, loadingAuthAccounts };
}

export default useGetSlots;
