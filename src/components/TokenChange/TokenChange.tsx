import { CYBER } from 'src/utils/config';
import { formatNumber } from 'src/utils/utils';
import cx from 'classnames';
import styles from './TokenChange.module.scss';
import FormatNumberTokens from '../FormatNumberTokens/FormatNumberTokens';

export type Props = {
  total: number;
  change?: number;
  className?: string;
};

function TokenChange({ total, change = 0, className }: Props) {
  const isIncrease = change > 0;

  return (
    <div className={cx(styles.wrapper, className)}>
      {change !== 0 && (
        <div
          className={cx(styles.change, {
            [styles.increase]: isIncrease,
          })}
        >
          {formatNumber(change)}
        </div>
      )}

      <FormatNumberTokens value={total} text={CYBER.DENOM_LIQUID_TOKEN} />
    </div>
  );
}

export default TokenChange;
