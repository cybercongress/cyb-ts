import { useEffect, useState } from 'react';
import { formatNumber, getNowUtcTime } from 'src/utils/utils';
import unixTimestamp from './utils';
import styles from './time.module.scss';

function Time() {
  const [timeSeconds, setTimeSeconds] = useState(0);
  const { days, minutes, hours } = unixTimestamp(timeSeconds / 1000);

  useEffect(() => {
    const getTime = () => {
      const utcTime = getNowUtcTime();
      setTimeSeconds(utcTime);
    };
    getTime();

    const timeInterval = setInterval(() => {
      getTime();
    }, 60000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <span>{formatNumber(days)}</span>
      <span className={styles.day}>day</span>
      <div>
        <span>{hours}</span>:<span>{minutes}</span>
      </div>
    </div>
  );
}

export default Time;
