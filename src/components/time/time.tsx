import { formatNumber } from 'src/utils/utils';
import { Link } from 'react-router-dom';
import unixTimestamp from './utils';
import styles from './time.module.scss';

function Time({ msTime, linkTo }: { msTime: number; linkTo: string }) {
  const { years, months, days, minutes, hours } = unixTimestamp(msTime / 1000); // convert to sec

  let valueTime = days;
  let titleTime = 'days';

  if (years > 1) {
    valueTime = years;
    titleTime = 'years';
  } else if (months > 1) {
    valueTime = months;
    titleTime = 'months';
  }

  return (
    <Link to={linkTo} className={styles.wrapper}>
      <span>{formatNumber(valueTime)}</span>
      <span className={styles.day}>{titleTime}</span>
      <div>
        <span>{hours}</span>:<span>{minutes}</span>
      </div>
    </Link>
  );
}

export default Time;
