import Logo from './components/Logo/Logo';
import TeleportText from './components/TeleportText/TeleportText';
import styles from './styles.module.scss';

function AboutTeleport() {
  return (
    <div className={styles.TeleportDescrpContainerContent}>
      <Logo />
      <TeleportText />
    </div>
  );
}

export default AboutTeleport;
