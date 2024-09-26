import { Tabs } from 'src/components';
import { Route, Routes, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import useAdviserTexts from 'src/features/adviser/useAdviserTexts';
import { useRobotContext } from '../robot.context';
import TreedView from './ui/TreedView';
import styles from './Brain.module.scss';
import GraphView from './ui/GraphView';
import GraphViewVR from './ui/GraphViewVR';
import { LIMIT_GRAPH } from './utils';

enum TabsKey {
  list = 'list',
  graph = 'graph',
  vr = 'vr',
}

function Brain() {
  const { address } = useRobotContext();

  const params = useParams();

  const selected = params['*'] || TabsKey.graph;

  useAdviserTexts({
    defaultText: useMemo(
      () => (
        <>
          neurons public knowledge cybergraph <br />
          {selected === TabsKey.graph && (
            <> that is how last {LIMIT_GRAPH} cyberlinks looks like </>
          )}
        </>
      ),
      [selected]
    ),
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <Tabs
          options={[
            {
              key: TabsKey.graph,
              to: './graph',
            },
            {
              key: TabsKey.vr,
              to: './vr',
            },
            {
              key: TabsKey.list,
              to: './list',
            },
          ]}
          selected={selected}
        />
      </div>

      <Routes>
        {['/', 'graph'].map((path) => (
          <Route
            key={path}
            path={path}
            element={<GraphView address={address} />}
          />
        ))}
        {['/', 'vr'].map((path) => (
          <Route
            key={path}
            path={path}
            element={<GraphViewVR address={address} />}
          />
        ))}

        <Route path="list" element={<TreedView address={address} />} />
      </Routes>
    </div>
  );
}

export default Brain;
