import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { formatNumber } from '../../utils/utils';
import styles from './styles.scss';
import { Tooltip } from 'src/components';

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

const formatKarma = (value, prefixCustom = PREFIXES) => {
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
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['karma', address],
    queryFn: async () => {
      try {
        const response = await queryClient.karma(address);

        return response.karma;
      } catch (error) {
        console.log('error', error);
        return null;
      }
    },
    enabled: Boolean(queryClient && address && address !== null),
  });

  return { data };
};

function Karma({ address }) {
  const { data } = useGetKarma(address);

  const karmaNumber = useMemo(() => {
    if (!data) {
      return null;
    }

    const value = formatKarma(data);

    return (
      <>
        {formatNumber(value.number)} {value.prefix}
      </>
    );
  }, [data]);

  return (
    <div className={styles.containerKarma}>
      <Tooltip tooltip="Karma measure the brightness of cyberlinks and particles created by you">
        {karmaNumber}
      </Tooltip>
    </div>
  );
}

export default Karma;
