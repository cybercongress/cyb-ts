import { Link } from 'react-router-dom';
import { ScriptingContextType } from 'src/contexts/scripting/scripting';
import type { ScriptMyCampanion } from 'src/services/scripting/types';
import styles from './soulCompanion.module.scss';
import { shortenString } from 'src/utils/string';

function SoulCompanion({
  status,
  metaItems,
}: {
  status: ScriptingContextType['status'];
  metaItems: ScriptMyCampanion['metaItems'];
}) {
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
