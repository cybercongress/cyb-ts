import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

type Props = {
  value: number | string;
  text?: string;
  to: string;
};

function TotalCount({ value, text, to }: Props) {
  return (
    <Link to={to}>
      <div className={styles.containerTotalCount}>
        <div className={styles.countValue}>+{value}</div>
        {text && <span className={styles.countText}>{text}</span>}
      </div>
    </Link>
  );
}

export default TotalCount;
