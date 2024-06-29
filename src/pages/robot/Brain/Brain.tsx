import { useEffect, useState } from 'react';
import { useAdviser } from 'src/features/adviser/context';
import { Tabs } from 'src/components';
import { useRobotContext } from '../robot.context';
import TreedView from './ui/TreedView';
import styles from './Brain.module.scss';
import { LIMIT_GRAPH } from './utils';
import GraphView from './ui/GraphView';

enum TabsKey {
  list = 'list',
  graph = 'graph',
}

function Brain() {
  const { address } = useRobotContext();
  const [selected, setSelected] = useState(TabsKey.list);
  const { setAdviser } = useAdviser();

  useEffect(() => {
    setAdviser(
      <>
        neurons public knowledge cybergraph <br />
        {selected === TabsKey.graph && (
          <> that is how last {LIMIT_GRAPH} cyberlinks looks like </>
        )}
      </>
    );
  }, [setAdviser, selected]);

  let content;

  if (selected === TabsKey.list) {
    content = <TreedView address={address} />;
  }

  if (selected === TabsKey.graph) {
    content = <GraphView address={address} />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <Tabs
          options={[TabsKey.list, TabsKey.graph].map((item) => {
            return { key: item, onClick: () => setSelected(item) };
          })}
          selected={selected}
        />
      </div>
      {content}
    </div>
  );
}

export default Brain;
