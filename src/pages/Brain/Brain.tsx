import CyberlinksGraphContainer from 'src/features/cyberlinks/CyberlinksGraph/CyberlinksGraphContainer';
import { ActionBar, Button } from 'src/components';
import useAdviserTexts from 'src/features/adviser/useAdviserTexts';
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
      <br />
      use url param to set different limit :
      <a
        href="/brain?limit=500"
        onClick={(e) => {
          e.preventDefault();

          setSearchParams({
            limit: 500,
          });
        }}
      >
        /brain?limit=500
      </a>
    </p>
  );
}
