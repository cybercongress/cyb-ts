import { Display } from 'src/components';
import styles from './TreedItem.module.scss';
import FetchContent from '../FetchContent/FetchContent';
import FetchContentFrom from '../FetchContentFrom/FetchContentFrom';

function TreedItem({
  link,
  address,
}: {
  link: { from: string; to: string };
  address: string;
}) {
  return (
    <Display>
      <div className={styles.wrapper}>
        <div className={styles.cidFrom}>
          <FetchContentFrom cid={link.from} parentId={address} />
        </div>
        <div className={styles.content}>
          <FetchContent cid={link.to} parentId={address} />
        </div>
      </div>
    </Display>
  );
}

export default TreedItem;
