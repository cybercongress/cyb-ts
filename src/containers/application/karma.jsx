import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../../context';
import { formatNumber } from '../../utils/utils';

const KARMA_ICON = '🔮';

const PREFIXES = [
  {
    prefix: 4,
    power: 10 ** 12,
  },
  {
    prefix: 3,
    power: 10 ** 9,
  },
  {
    prefix: 2,
    power: 10 ** 6,
  },
  {
    prefix: 1,
    power: 10 ** 3,
  },
];

export const formatKarma = (value, prefixCustom = PREFIXES) => {
  const { prefix = '', power = 1 } =
    prefixCustom.find((powerItem) => value >= powerItem.power) || {};

  return {
    number: new BigNumber(value)
      .dividedBy(power)
      .dp(0, BigNumber.ROUND_FLOOR)
      .toNumber(),
    prefix: KARMA_ICON.repeat(prefix),
  };
};

const useGetKarma = (address) => {
  const { jsCyber } = useContext(AppContext);

  const { data } = useQuery({
    queryKey: ['karma', address],
    queryFn: async () => {
      try {
        const response = await jsCyber.karma(address);

        return response.karma;
      } catch (error) {
        console.log('error', error);
        return null;
      }
    },
    enabled: Boolean(jsCyber && address && address !== null),
  });

  return { data };
};

function Karma({ address }) {
  const { data } = useGetKarma(address);

  const karmaNumber = useMemo(() => {
    if (data && data !== null) {
      const value = formatKarma(data);

      return (
        <>
          {formatNumber(value.number)} {value.prefix}
        </>
      );
    }

    return null;
  }, [data]);

  return <div style={{ color: '#fff'; font-size:16px; padding-top:16px }}>{karmaNumber}</div>;
}

export default Karma;
