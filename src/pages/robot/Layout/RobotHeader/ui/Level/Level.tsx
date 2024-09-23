import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Dots } from 'src/components';
import getPrefixNumber from 'src/utils/getPrefixNumber';

const POWER = 1000;

enum LevelValue {
  energy = 'energy',
  sigma = 'sigma',
  karma = 'karma',
}

export type Props = {
  energy: number;
  sigma: number;
  karma: string;
};

function Level({ value }: { value: Props }) {
  const level = useMemo(() => {
    if (!value) {
      return <Dots />;
    }

    return Object.keys(LevelValue).reduce((acc: number, item) => {
      const prefix = getPrefixNumber(
        POWER,
        new BigNumber(value[item] || 0).toNumber()
      );

      return new BigNumber(acc).plus(prefix).toNumber();
    }, 0);
  }, [value]);

  return (
    <span style={{ color: 'var(--grayscale-dark)' }}>
      level <span style={{ color: 'var(--blue-light)' }}>{level}</span>
    </span>
  );
}

export default Level;
