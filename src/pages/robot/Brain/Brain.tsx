import { useEffect, useState } from 'react';
import { useAdviser } from 'src/features/adviser/context';
import { Button } from 'src/components';
import { useRobotContext } from '../robot.context';
import TreedView from './ui/TreedView';
import styles from './Brain.module.scss';
import { LIMIT_GRAPH } from './utils';
import GraphView from './ui/GraphView';

function Brain() {
  const { address } = useRobotContext();
  const [graphView, setGraphView] = useState(false);
  const { setAdviser } = useAdviser();

  useEffect(() => {
    setAdviser(
      <>
        neurons public knowledge cybergraph <br />
        {graphView && (
          <> that is how last {LIMIT_GRAPH} cyberlinks looks like </>
        )}
      </>
    );
  }, [setAdviser, graphView]);

  let content = <GraphView address={address} />;

  if (!graphView) {
    content = <TreedView address={address} />;
  }

  const setGraphViewFc = () => setGraphView((item) => !item);

  return (
    <div className={styles.wrapper}>
      <Button onClick={setGraphViewFc} text="change view" />
      {content}
    </div>
  );
}

export default Brain;
