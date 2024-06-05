import { timeSince } from 'src/utils/utils';
import { dateToUtcNumber, getNowUtcNumber } from 'src/utils/date';
import styles from './CreatedAt.module.scss';

export type Props = {
  timeAt: string;
};

function CreatedAt({ timeAt }: Props) {
  let timeAgoInMS = 0;

  const time = getNowUtcNumber() - dateToUtcNumber(timeAt);
  if (time && time > 0) {
    timeAgoInMS = time;
  }

  const timeSinceValue = timeSince(timeAgoInMS);

  return (
    <div className={styles.createdAt}>
      {timeSinceValue === 'now' ? timeSinceValue : `${timeSinceValue} ago`}
    </div>
  );
}

export default CreatedAt;
