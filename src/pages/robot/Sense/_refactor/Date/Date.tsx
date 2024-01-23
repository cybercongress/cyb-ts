import dateFormat from 'dateformat';

import cx from 'classnames';
import styles from './Date.module.scss';
import { Tooltip } from 'src/components';

type Props = {
  timestamp: number;
  className?: string;
};

function Date2({ timestamp, className }: Props) {
  const date = new Date(timestamp);
  const today = new Date();

  // Compare the date part of the timestamp with the date part of the current date
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const formattedDate = isToday
    ? dateFormat(date, 'HH:MM')
    : dateFormat(date, 'dd/mm');

  return (
    <div className={cx(styles.date, className)}>
      <Tooltip tooltip={dateFormat(date, 'dd/mm/yyyy HH:MM')}>
        <time>{formattedDate}</time>
      </Tooltip>
    </div>
  );
}

export default Date2;
