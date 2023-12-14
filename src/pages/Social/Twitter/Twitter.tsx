import { LinkWindow } from 'src/components/link/link';
import twitterIcon from './twitter.png';

import styles from './Twitter.module.scss';

function Twitter() {
  return (
    <LinkWindow to="https://twitter.com/cyber_devs">
      <img className={styles.icon} src={twitterIcon} alt="Twitter" />
      <span>Twitter</span>
    </LinkWindow>
  );
}

export default Twitter;
