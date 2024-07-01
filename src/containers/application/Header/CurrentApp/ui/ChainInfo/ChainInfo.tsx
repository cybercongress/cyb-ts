import { BandwidthBar } from 'src/components';
import styles from './ChainInfo.module.scss';
import AppName from '../AppName/AppName';

function ChainInfo() {
  return (
    <div className={styles.containerInfoSwitch}>
      <AppName />
      <div className={styles.containerBandwidthBar}>
        <BandwidthBar tooltipPlacement="bottom" />
      </div>
    </div>
  );
}

export default ChainInfo;
