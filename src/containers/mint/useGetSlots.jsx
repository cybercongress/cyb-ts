import { useEffect, useState, useContext } from 'react';
import { authAccounts } from '../../utils/search/utils';
import { AppContext } from '../../context';
import { convertResources } from '../../utils/utils';

const MILLISECONDS_IN_SECOND = 1000;

const initStateVested = {
  hydrogen: 0,
  millivolt: 0,
  milliampere: 0,
};

const initBalacesResource = {
  millivolt: 0,
  milliampere: 0,
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

function useGetSlots(address, updateAddress) {
  const { jsCyber } = useContext(AppContext);
  const [addressActive, setAddressActive] = useState(null);
  const [slotsData, setSlotsData] = useState([]);
  const [loadingAuthAccounts, setLoadingAuthAccounts] = useState(true);
  const [originalVesting, setOriginalVesting] = useState(initStateVested);
  const [balacesResource, setBalacesResource] = useState(initBalacesResource);
  const [vested, setVested] = useState(initStateVested);

  useEffect(() => {
    if (address !== null) {
      if (address.bech32) {
        setAddressActive(address.bech32);
      } else {
        setAddressActive(address);
      }
    }
  }, [address]);

  useEffect(() => {
    const getAuth = async () => {
      setLoadingAuthAccounts(true);
      setOriginalVesting(initStateVested);
      setSlotsData([]);
      setVested(initStateVested);
      if (addressActive !== null) {
        const originalVestingInitAmount = {
          hydrogen: 0,
          millivolt: 0,
          milliampere: 0,
        };

        const getAccount = await authAccounts(addressActive);
        if (getAccount !== null && getAccount.result.value.vesting_periods) {
          const { vesting_periods: vestingPeriods } = getAccount.result.value;
          const { original_vesting: originalVestingAmount } =
            getAccount.result.value.base_vesting_account;
          const { start_time: startTime } = getAccount.result.value;

          const balances = getCalculationBalance(originalVestingAmount);
          if (balances.hydrogen) {
            originalVestingInitAmount.hydrogen = balances.hydrogen;
          }
          if (balances.millivolt) {
            originalVestingInitAmount.millivolt = convertResources(
              balances.millivolt
            );
          }
          if (balances.milliampere) {
            originalVestingInitAmount.milliampere = convertResources(
              balances.milliampere
            );
          }
          setOriginalVesting(originalVestingInitAmount);

          const { tempData, vestedAmount } = getVestingPeriodsData(
            vestingPeriods,
            startTime
          );

          setVested(vestedAmount);
          setSlotsData(tempData);
          setLoadingAuthAccounts(false);
        } else {
          setOriginalVesting(initStateVested);
          setLoadingAuthAccounts(false);
          setSlotsData([]);
          setVested(initStateVested);
        }
      } else {
        setOriginalVesting(initStateVested);
        setLoadingAuthAccounts(false);
        setSlotsData([]);
        setVested(initStateVested);
      }
    };
    getAuth();
  }, [updateAddress, addressActive]);

  useEffect(() => {
    const getBalacesResource = async () => {
      setBalacesResource(initBalacesResource);
      if (addressActive !== null && jsCyber !== null) {
        const balacesAmount = {
          millivolt: 0,
          milliampere: 0,
        };

        const getAllBalancesPromise = await jsCyber.getAllBalances(
          addressActive
        );

        const balances = getCalculationBalance(getAllBalancesPromise);
        if (balances.millivolt) {
          balacesAmount.millivolt = convertResources(balances.millivolt);
        }
        if (balances.milliampere) {
          balacesAmount.milliampere = convertResources(balances.milliampere);
        }
        setBalacesResource(balacesAmount);
      } else {
        setBalacesResource(initBalacesResource);
      }
    };
    getBalacesResource();
  }, [updateAddress, addressActive, jsCyber]);

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
    const vestedAmount = {
      ...initStateVested,
    };

    if (data.length > 0) {
      data.forEach((item) => {
        const obj = {};
        length += parseFloat(item.length);
        const lengthMs = length * MILLISECONDS_IN_SECOND;
        obj.length = length * MILLISECONDS_IN_SECOND;
        const d = new Date();
        if (lengthMs < Date.parse(d)) {
          const time = Date.parse(d) - lengthMs;
          obj.status = 'Liquid';
          obj.time = `${timeSince(time)} ago`;
        } else {
          const time = lengthMs - Date.parse(d);
          obj.status = 'Unfreezing';
          obj.time = `${timeSince(time)} left`;
        }
        // obj.status = 'empty';
        item.amount.forEach((itemAmount) => {
          const amount = {};
          if (
            itemAmount.denom === 'millivolt' ||
            itemAmount.denom === 'milliampere'
          ) {
            amount[itemAmount.denom] = convertResources(
              parseFloat(itemAmount.amount)
            );
          } else {
            amount[itemAmount.denom] = parseFloat(itemAmount.amount);
          }
          if (obj.amount) {
            obj.amount = { ...obj.amount, ...amount };
          } else {
            obj.amount = amount;
          }
        });
        if (obj.status !== 'Unfreezing') {
          if (obj.amount.hydrogen) {
            vestedAmount.hydrogen += obj.amount.hydrogen;
          }
          if (obj.amount.milliampere) {
            vestedAmount.milliampere += obj.amount.milliampere;
          }
          if (obj.amount.millivolt) {
            vestedAmount.millivolt += obj.amount.millivolt;
          }
        }
        tempData.push(obj);
      });
    }

    return { tempData, vestedAmount };
  };

  return {
    slotsData,
    originalVesting,
    loadingAuthAccounts,
    balacesResource,
    vested,
  };
}

export default useGetSlots;
