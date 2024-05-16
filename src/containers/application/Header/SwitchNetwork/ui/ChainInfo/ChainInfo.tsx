import { CHAIN_ID } from 'src/constants/config';
import { BandwidthBar } from 'src/components';
import styles from './ChainInfo.module.scss';

function ChainInfo() {
  return (
    <div className={styles.containerInfoSwitch}>
      <button
        className={styles.btnContainerText}
        type="button"
        style={{ fontSize: '20px' }}
      >
        {CHAIN_ID}
      </button>
      <div className={styles.containerBandwidthBar}>
        <BandwidthBar tooltipPlacement="bottom" />
      </div>
    </div>
  );
}

export default ChainInfo;
