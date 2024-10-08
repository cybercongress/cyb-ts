import CyberlinksGraphContainer from 'src/features/cyberlinks/CyberlinksGraph/CyberlinksGraphContainer';
import useAdviserTexts from 'src/features/adviser/useAdviserTexts';
import styles from './Brain.module.scss';
import useGraphLimit from '../robot/Brain/useGraphLimit';

function Brain() {
  const { limit } = useGraphLimit();

  useAdviserTexts({
    defaultText: 'cyber graph',
  });

  return (
    <div className={styles.wrapper}>
      <CyberlinksGraphContainer toPortal limit={limit} />

      {/* <GraphActionBar>
        <Button
          className={styles.link}
          link="https://cosmograph.app/run/?data=https://gateway.ipfs.cybernode.ai/ipfs/QmQ3snofqRrDhpANRCwZrCPG7rAvABrkL9KHreMtmYDiCL"
        >
          External graph <span />
        </Button>
      </GraphActionBar> */}
    </div>
  );
}

export default Brain;
