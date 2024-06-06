import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector } from 'src/redux/hooks';
import styles from './TimeHistory.module.scss';
import TimeHistoryItem from './ui/TimeHistoryItem/TimeHistoryItem';

function TimeHistory() {
  const { timeHistory } = useAppSelector((state) => state.timeHistory);

  const renderItem = useMemo(() => {
    if (!timeHistory.length) {
      return null;
    }

    return [...timeHistory].reverse().map(({ time, action }) => {
      const key = uuidv4();

      return <TimeHistoryItem key={key} time={time} action={action} />;
    });
  }, [timeHistory]);

  return <div className={styles.wrapper}>{renderItem}</div>;
}

export default TimeHistory;
