import discordIcon from './discord.png';

import styles from './Discord.module.scss';

function Discord() {
  return (
    <div className={styles.wrapper}>
      <a href="https://discord.gg/jjEaDKmq" target="_blank" rel="noreferrer">
        <img className={styles.icon} src={discordIcon} alt="Cyber Discord" />
      </a>
    </div>
  );
}

export default Discord;
