import dateFormat from 'dateformat';
import styles from './DateTitle.module.scss';
import { Tooltip } from 'src/components';

function DateTitle({ date }: { date: Date }) {
  return (
    <p className={styles.date}>
      <Tooltip tooltip={dateFormat(date, 'dd/mm/yyyy')}>
        {dateFormat(date, 'mmm dd')}
      </Tooltip>
    </p>
  );
}

export default DateTitle;
