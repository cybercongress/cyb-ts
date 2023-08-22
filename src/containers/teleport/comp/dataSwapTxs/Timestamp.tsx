import { getNowUtcTime, timeSince } from 'src/utils/utils';
import styles from './styles.module.scss';

function Timestamp({ timestamp }: { timestamp: string }) {
  let timeAgoInMS = null;

  const time = getNowUtcTime() - Date.parse(timestamp);
  if (time > 0) {
    timeAgoInMS = time;
  }

  return (
    <div className={styles.containerTime}>
      <div>{timeSince(timeAgoInMS)} ago</div>
    </div>
  );
}

export default Timestamp;
