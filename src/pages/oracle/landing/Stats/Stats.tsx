import { FC } from 'react';
import cx from 'classnames';
import { TypingText } from 'src/components/TypingText/TypingText';
import { formatNumber } from 'src/utils/utils';
import styles from './Stats.module.scss';

interface StatsProps {
  /** The type of statistic being displayed */
  type: string;
  /** The numerical value to display */
  value?: number;
  /** The descriptive text for the value */
  text?: string;
  /** The amount of change to display */
  change?: number;
  /** The time period for the change */
  time?: string;
}

export const Stats: FC<StatsProps> = ({ 
  type,
  value,
  text = '',
  change,
  time
}) => {
  if (!value) {
    return null;
  }

  const formattedValue = value.toLocaleString().replaceAll(',', ' ');
  const formattedChange = change ? formatNumber(change) : null;

  return (
    <div className={cx(styles.wrapper)}>
      <TypingText
        content={formattedValue}
        delay={40}
      />{' '}
      <strong>{text}</strong>{' '}
      {change ? (
        <p className={styles.change}>
          | <strong>+{formattedChange}</strong> in {time}
        </p>
      ) : (
        <>
          and <strong>growing</strong>
        </>
      )}
    </div>
  );
};

export default Stats;
