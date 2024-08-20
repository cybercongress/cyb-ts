import CyberlinksGraphContainer from 'src/features/cyberlinks/CyberlinksGraph/CyberlinksGraphContainer';
import { ActionBar, Button } from 'src/components';
import { useSearchParams } from 'react-router-dom';
import useAdviserTexts from 'src/features/adviser/useAdviserTexts';
import styles from './Brain.module.scss';

const DEFAULT_LIMIT = 10000;

function Brain() {
  const [searchParams] = useSearchParams();

  const limit = Number(searchParams.get('limit')) || DEFAULT_LIMIT;

  useAdviserTexts({
    defaultText: 'cyber graph',
  });

  return (
    <div className={styles.wrapper}>
      <CyberlinksGraphContainer toPortal limit={limit} />

      <p
        style={{
          zIndex: 10,
        }}
      >
        Limit is: {limit.toLocaleString()}
        <br />
        use url param to set different limit :
        <a href="/brain?limit=500">/brain?limit=500</a>
      </p>

      <ActionBar>
        <Button
          className={styles.link}
          link="https://cosmograph.app/run/?data=https://gateway.ipfs.cybernode.ai/ipfs/QmQ3snofqRrDhpANRCwZrCPG7rAvABrkL9KHreMtmYDiCL"
        >
          External graph <span />
        </Button>
      </ActionBar>
    </div>
  );
}

export default Brain;
