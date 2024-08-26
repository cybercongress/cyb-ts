import { useEffect, useState } from 'react';
import { getIpfsHash } from 'src/utils/ipfs/helpers';
import { trimString } from 'src/utils/utils';
import styles from './CurrentCid.modules.scss';

function CurrentCid({ text }: { text: string }) {
  const [textCid, setTextCid] = useState<string>('');

  useEffect(() => {
    if (!text) {
      return;
    }

    (async () => {
      const cid = await getIpfsHash(text);
      setTextCid(cid);
    })();
  }, [text]);

  return <span className={styles.cid}>{trimString(textCid, 5, 4)}</span>;
}

export default CurrentCid;
