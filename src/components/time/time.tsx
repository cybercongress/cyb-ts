import { useEffect, useState } from 'react';
import { formatNumber, getNowUtcTime } from 'src/utils/utils';
import { Link } from 'react-router-dom';
import { useAppSelector } from 'src/redux/hooks';
import usePassportByAddress from 'src/features/passport/hooks/usePassportByAddress';
import { routes } from 'src/routes';
import unixTimestamp from './utils';
import styles from './time.module.scss';

function Time() {
  const { defaultAccount } = useAppSelector((state) => state.pocket);
  const useGetAddress = defaultAccount?.account?.cyber?.bech32 || null;
  const { passport } = usePassportByAddress(useGetAddress);
  const useGetName = passport?.extension.nickname;
  const [timeSeconds, setTimeSeconds] = useState(0);
  const { days, minutes, hours } = unixTimestamp(timeSeconds / 1000);

  const linkAddress = useGetName
    ? routes.robotPassport.getLink(useGetName)
    : useGetAddress
    ? routes.neuron.getLink(useGetAddress)
    : undefined;

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
    <Link
      to={linkAddress ? `${linkAddress}/timeline` : routes.robot.path}
      className={styles.wrapper}
    >
      <span>{formatNumber(days)}</span>
      <span className={styles.day}>day</span>
      <div>
        <span>{hours}</span>:<span>{minutes}</span>
      </div>
    </Link>
  );
}

export default Time;
