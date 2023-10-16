import { LinkWindow } from 'src/components/link/link';
import discordIcon from './discord.png';

import styles from './Discord.module.scss';

function Discord() {
  return (
    <div className={styles.wrapper}>
      <LinkWindow to="https://discord.gg/jjEaDKmq">
        <img className={styles.icon} src={discordIcon} alt="Cyber Discord" />
      </LinkWindow>
    </div>
  );
}

export default Discord;
