import { Link } from 'react-router-dom';
import {
  ScriptingContextType,
  useScripting,
} from 'src/contexts/scripting/scripting';
import type { ScriptMyCampanion } from 'src/services/scripting/types';
import styles from './soulCompanion.module.scss';
import { shortenString } from 'src/utils/string';
import { ParticleCid } from 'src/types/base';
import { IPFSContentDetails } from 'src/services/ipfs/types';
import { Option } from 'src/types';
import { useEffect, useState } from 'react';
import { proxy } from 'comlink';

type AskCompanionStatus = 'loading' | 'ready' | 'pending' | 'done' | 'error';

function SoulCompanion({
  cid,
  details,
  skip,
}: {
  cid: ParticleCid;
  details: Option<IPFSContentDetails>;
  skip: boolean;
}) {
  const [metaItems, setMetaItems] = useState<ScriptMyCampanion['metaItems']>(
    []
  );
  const [status, setStatus] = useState<AskCompanionStatus>('loading');
  const { rune, isSoulInitialized } = useScripting();

  useEffect(() => {
    if (!skip && isSoulInitialized && details) {
      if (details.type && details.type !== 'text' && details.text) {
        setStatus('done');
        setMetaItems([
          { type: 'text', text: `Skip companion for '${details.content}'.` },
        ]);
        return;
      }

      rune
        ?.askCompanion(
          cid,
          details!.type!,
          details!.text!.substring(0, 255),
          proxy((data = {}) => console.log('CALLBACK'))
        )
        .then((result) => {
          setMetaItems(result.metaItems);
          setStatus('done');
        });
    }
  }, [cid, skip, rune, isSoulInitialized, details]);

  useEffect(() => {
    setMetaItems([]);
  }, [cid]);

  if (status !== 'done' && metaItems) {
    return (
      <div
        className={styles.itemText}
      >{`soul companion status: ${status}`}</div>
    );
  }
  return (
    <div>
      <ul className={styles.itemLinks}>
        {metaItems.map((item, index) => (
          <li key={`soul_comp_${index}`}>
            {item.type === 'text' && (
              <p className={styles.itemText}>{item.text}</p>
            )}
            {item.type === 'link' && (
              <Link className={styles.itemLink} to={item.url}>
                {shortenString(item.title, 64)}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SoulCompanion;
