import { BandwidthBar } from 'src/components';
import styles from './ChainInfo.module.scss';
import CurrentApp from '../CurrentApp/CurrentApp';

function ChainInfo() {
  return (
    <div className={styles.containerInfoSwitch}>
      <CurrentApp />
      <div className={styles.containerBandwidthBar}>
        <BandwidthBar tooltipPlacement="bottom" />
      </div>
    </div>
  );
}

export default ChainInfo;
