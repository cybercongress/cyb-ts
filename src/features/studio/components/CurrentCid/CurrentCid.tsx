import { trimString } from 'src/utils/utils';
import styles from './CurrentCid.modules.scss';
import { useStudioContext } from '../../studio.context';

function CurrentCid() {
  const { lastCid } = useStudioContext();

  return <span className={styles.cid}>{trimString(lastCid || '', 5, 4)}</span>;
}

export default CurrentCid;
