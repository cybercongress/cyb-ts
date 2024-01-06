import dateFormat from 'dateformat';

import cx from 'classnames';
import styles from './Date.module.scss';

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
    : dateFormat(date, 'dd/mm HH:MM');

  return (
    <time className={cx(styles.date, className)}>
      {/* {formattedDate} */}
      {dateFormat(timestamp, 'HH:MM')}
      <br />
      {dateFormat(timestamp, 'dd/mm')}
    </time>
  );
}

export default Date2;
