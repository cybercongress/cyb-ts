import { formatNumber } from 'src/utils/utils';
import cx from 'classnames';
import styles from './TokenChange.module.scss';
import FormatNumberTokens from '../FormatNumberTokens/FormatNumberTokens';
import { DENOM_LIQUID } from 'src/constants/config';

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

      <FormatNumberTokens value={total} text={DENOM_LIQUID} />
    </div>
  );
}

export default TokenChange;
