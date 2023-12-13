import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from 'src/contexts/queryClient';
import { authAccounts } from '../../utils/search/utils';
import { convertResources } from '../../utils/utils';
import { CYBER } from '../../utils/config';
import { Slot } from './types';

const MILLISECONDS_IN_SECOND = 1000;

const initStateVested = {
  [CYBER.DENOM_LIQUID_TOKEN]: 0,
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

const authAccountsFetcher = async (addressActive) => {
  const response = await authAccounts(addressActive);

  if (response !== null) {
    return response;
  }

  return null;
};

const balanceFetcher = (address, client) => {
  if (client === null || address === null) {
    return null;
  }

  return client.getAllBalances(address);
};

function useGetSlots(addressActive) {
  const queryClient = useQueryClient();
  const [slotsData, setSlotsData] = useState<Slot[]>([]);
  const [loadingAuthAccounts, setLoadingAuthAccounts] = useState(true);
  const [originalVesting, setOriginalVesting] = useState(initStateVested);
  const [balacesResource, setBalacesResource] = useState(initBalacesResource);
  const [vested, setVested] = useState(initStateVested);

  const { data: dataAuthAccounts, refetch: refetchAuthAccounts } = useQuery(
    ['authAccounts', addressActive],
    () => authAccountsFetcher(addressActive),
    {
      enabled: Boolean(addressActive),
    }
  );
  const { data: dataGetAllBalances, refetch: refetchGetAllBalances } = useQuery(
    ['getAllBalances', addressActive],
    () => balanceFetcher(addressActive, queryClient),
    {
      enabled: Boolean(queryClient && addressActive),
    }
  );

  function update() {
    refetchGetAllBalances();
    refetchAuthAccounts();
    getBalacesResource();
  }

  useEffect(() => {
    const getAuth = async () => {
      setLoadingAuthAccounts(true);
      setOriginalVesting(initStateVested);
      setSlotsData([]);
      setVested(initStateVested);

      const originalVestingInitAmount = {
        [CYBER.DENOM_LIQUID_TOKEN]: 0,
        millivolt: 0,
        milliampere: 0,
      };

      if (dataAuthAccounts && dataAuthAccounts.result.value.vesting_periods) {
        const { vesting_periods: vestingPeriods } =
          dataAuthAccounts.result.value;
        const { original_vesting: originalVestingAmount } =
          dataAuthAccounts.result.value.base_vesting_account;
        const { start_time: startTime } = dataAuthAccounts.result.value;

        const balances = getCalculationBalance(originalVestingAmount);
        if (balances[CYBER.DENOM_LIQUID_TOKEN]) {
          originalVestingInitAmount[CYBER.DENOM_LIQUID_TOKEN] =
            balances[CYBER.DENOM_LIQUID_TOKEN];
        }
        if (balances.millivolt) {
          originalVestingInitAmount.millivolt = balances.millivolt;
        }
        if (balances.milliampere) {
          originalVestingInitAmount.milliampere = balances.milliampere;
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
    };
    getAuth();
  }, [dataAuthAccounts]);

  const getBalacesResource = useCallback(() => {
    setBalacesResource(initBalacesResource);
    if (dataGetAllBalances && dataGetAllBalances !== null) {
      const balacesAmount = {
        millivolt: 0,
        milliampere: 0,
      };

      const balances = getCalculationBalance(dataGetAllBalances);
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
  }, [dataGetAllBalances]);

  useEffect(() => {
    getBalacesResource();
  }, [addressActive, getBalacesResource]);

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
    const tempData: Slot[] = [];
    let length = parseFloat(startTime);
    const vestedAmount = {
      ...initStateVested,
    };

    if (data.length > 0) {
      data.forEach((item) => {
        const obj: Slot = {};
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
            amount[itemAmount.denom] = parseFloat(itemAmount.amount);
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
          if (obj.amount[CYBER.DENOM_LIQUID_TOKEN]) {
            vestedAmount[CYBER.DENOM_LIQUID_TOKEN] +=
              obj.amount[CYBER.DENOM_LIQUID_TOKEN];
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
    update,
  };
}

export default useGetSlots;
