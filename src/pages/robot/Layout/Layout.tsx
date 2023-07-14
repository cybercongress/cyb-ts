import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Loader2 from 'src/components/ui/Loader2';
import useMenuCounts from './useMenuCounts';

import RobotHeader from './RobotHeader/RobotHeader';
import { useRobotContext } from '../robot.context';
import WrappedActionBar from './WrappedActionBar';
import styles from './Layout.module.scss';
import RobotMenu from './RobotMenu/RobotMenu';

function Layout() {
  const { address, isOwner, isLoading, nickname } = useRobotContext();

  const counts = useMenuCounts(address);

  return (
    <div className={styles.wrapper}>
      <Helmet>
        <title>Robot {nickname || address || ''}</title>
      </Helmet>

      <RobotMenu counts={counts} />
      <main>
        {isLoading ? (
          <Loader2 />
        ) : (
          <>
            {!isOwner && <RobotHeader />}

            <Outlet />

            <WrappedActionBar />
          </>
        )}
      </main>
      <RobotMenu counts={counts} isRight />
    </div>
  );
}

export default Layout;
