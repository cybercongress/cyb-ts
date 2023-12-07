import CyberlinksGraphContainer from 'src/features/cyberlinks/CyberlinksGraph/CyberlinksGraphContainer';
import { LinkWindow } from 'src/components/link/link';
import styles from './Brain.module.scss';

function Brain() {
  return (
    <div className={styles.wrapper}>
      <LinkWindow
        className={styles.link}
        to="https://cosmograph.app/run/?data=https://gateway.ipfs.cybernode.ai/ipfs/QmQ3snofqRrDhpANRCwZrCPG7rAvABrkL9KHreMtmYDiCL"
      >
        Full Graph 🔗
      </LinkWindow>
      <CyberlinksGraphContainer toPortal />
    </div>
  );
}

export default Brain;
