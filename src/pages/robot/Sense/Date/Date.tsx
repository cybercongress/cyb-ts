import dateFormat from 'dateformat';

import cx from 'classnames';
import styles from './Date.module.scss';

type Props = {
  timestamp: number;
  className?: string;
};

function Date({ timestamp, className }: Props) {
  return (
    <time className={cx(styles.date, className)}>
      {dateFormat(timestamp, 'dd/mm HH:MM')}
    </time>
  );
}

export default Date;
