import { useEffect, useState } from 'react';
import dateFormat from 'dateformat';
import { getNowUtcTime } from 'src/utils/utils';
import { useDevice } from 'src/contexts/device';
import { useAppSelector } from 'src/redux/hooks';
import usePassportByAddress from 'src/features/passport/hooks/usePassportByAddress';
import { routes } from 'src/routes';
import { Time } from 'src/components';
import { Link } from 'react-router-dom';
import styles from './TimeFooter.module.scss';

function TimeFooter() {
  const { defaultAccount } = useAppSelector((state) => state.pocket);
  const { isMobile: mobile } = useDevice();
  const useGetAddress = defaultAccount?.account?.cyber?.bech32 || null;
  const { passport } = usePassportByAddress(useGetAddress);
  const useGetName = passport?.extension.nickname;
  const [timeSeconds, setTimeSeconds] = useState(0);

  const linkAddress = useGetName
    ? routes.robotPassport.getLink(useGetName)
    : useGetAddress
    ? routes.neuron.getLink(useGetAddress)
    : undefined;

  const linkTime = linkAddress ? `${linkAddress}/time` : routes.robot.path;

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
    <Link to={linkTime} className={styles.wrapper}>
      {!mobile && <Time msTime={timeSeconds} />}
      <span className={styles.utcTime}>
        {dateFormat(new Date(timeSeconds), 'HH:MM')}
      </span>
    </Link>
  );
}

export default TimeFooter;