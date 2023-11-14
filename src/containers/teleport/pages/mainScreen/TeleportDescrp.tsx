import TeleportLogo from './components/TeleportLogo/TeleportLogo';
import TeleportText from './components/TeleportText/TeleportText';
import styles from './styles.module.scss';

function TeleportDescrp() {
  return (
    <div className={styles.TeleportDescrpContainerContent}>
      <TeleportLogo />
      <TeleportText />
    </div>
  );
}

export default TeleportDescrp;
