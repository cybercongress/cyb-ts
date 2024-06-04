import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './TimeHistory.module.scss';
import { testData } from './testData';
import TimeHistoryItem from './ui/TimeHistoryItem/TimeHistoryItem';

function TimeHistory() {
  const renderItem = useMemo(() => {
    return testData.map(({ time, action }) => {
      const key = uuidv4();

      return <TimeHistoryItem key={key} time={time} action={action} />;
    });
  }, []);

  return <div className={styles.wrapper}>{renderItem}</div>;
}

export default TimeHistory;
