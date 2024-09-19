import CyberlinksGraphContainer from 'src/features/cyberlinks/CyberlinksGraph/CyberlinksGraphContainer';
import { Button } from 'src/components';
import useAdviserTexts from 'src/features/adviser/useAdviserTexts';
import GraphActionBar from 'src/features/cyberlinks/graph/GraphActionBar/GraphActionBar';
import styles from './Brain.module.scss';
import useGraphLimit from '../robot/Brain/useGraphLimit';

function Brain() {
  const { limit, setSearchParams } = useGraphLimit();

  useAdviserTexts({
    defaultText: 'cyber graph',
  });

  return (
    <div className={styles.wrapper}>
      <CyberlinksGraphContainer toPortal limit={limit} />

      <ParamsBlock limit={limit} setSearchParams={setSearchParams} />

      <GraphActionBar>
        <Button
          className={styles.link}
          link="https://cosmograph.app/run/?data=https://gateway.ipfs.cybernode.ai/ipfs/QmQ3snofqRrDhpANRCwZrCPG7rAvABrkL9KHreMtmYDiCL"
        >
          External graph <span />
        </Button>
      </GraphActionBar>
    </div>
  );
}

export default Brain;

export function ParamsBlock({ limit, setSearchParams }) {
  return (
    <p
      style={{
        textAlign: 'center',
        zIndex: 10,
        position: 'relative',
        marginBottom: 20,
      }}
    >
      Limit is: {limit.toLocaleString()}
    </p>
  );
}
