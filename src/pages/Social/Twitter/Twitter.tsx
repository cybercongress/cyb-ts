import { LinkWindow } from 'src/components/link/link';
import twitterIcon from './twitter.png';

import styles from './Twitter.module.scss';

function Twitter() {
  return (
    <div className={styles.wrapper}>
      <LinkWindow to="https://twitter.com/cyber_devs">
        <img className={styles.icon} src={twitterIcon} alt="Cyber Twitter" />
      </LinkWindow>
    </div>
  );
}

export default Twitter;
