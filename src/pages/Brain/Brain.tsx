import CyberlinksGraphContainer from 'src/features/cyberlinks/CyberlinksGraph/CyberlinksGraphContainer';
import { ActionBar, Button } from 'src/components';
import styles from './Brain.module.scss';

function Brain() {
  return (
    <div className={styles.wrapper}>
      <CyberlinksGraphContainer toPortal />

      <ActionBar>
        <Button
          className={styles.link}
          link="https://cosmograph.app/run/?data=https://gateway.ipfs.cybernode.ai/ipfs/QmQ3snofqRrDhpANRCwZrCPG7rAvABrkL9KHreMtmYDiCL"
        >
          Full graph <span />
        </Button>
      </ActionBar>
    </div>
  );
}

export default Brain;
