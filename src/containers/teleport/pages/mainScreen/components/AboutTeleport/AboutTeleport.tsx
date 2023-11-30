import Logo from '../Logo/Logo';
import TeleportText from '../TeleportText/TeleportText';
import styles from './AboutTeleport.module.scss';

function AboutTeleport() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>teleport</h1>
      <Logo />
      <TeleportText />
    </div>
  );
}

export default AboutTeleport;
