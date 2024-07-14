import { formatNumber } from 'src/utils/utils';
import { Link } from 'react-router-dom';
import { convertTimestampToString } from 'src/utils/date';
import styles from './time.module.scss';

function Time({ msTime, linkTo }: { msTime: number; linkTo?: string }) {
  const [valueTime, prefixTime] = convertTimestampToString(msTime).split(' ');
  let Component: HTMLSpanElement | Link = 'span';

  if (linkTo) {
    Component = Link;
  }

  return (
    <Component to={linkTo} className={styles.wrapper}>
      <span>{formatNumber(valueTime)}</span>
      <span className={styles.prefix}>{prefixTime}</span>
    </Component>
  );
}

export default Time;
