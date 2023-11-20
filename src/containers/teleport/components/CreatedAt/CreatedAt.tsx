import { getNowUtcTime, timeSince } from 'src/utils/utils';
import styles from './CreatedAt.module.scss';

function CreatedAt({ timeAt }: { timeAt: string | number }) {
  let timeAgoInMS = 0;

  const time = getNowUtcTime() - new Date(timeAt).getTime();
  if (time && time > 0) {
    timeAgoInMS = time;
  }

  const timeSinceValue = timeSince(timeAgoInMS);

  return (
    <div className={styles.CreatedAt}>
      {timeSinceValue === 'now' ? timeSinceValue : `${timeSinceValue} ago`}
    </div>
  );
}

export default CreatedAt;
