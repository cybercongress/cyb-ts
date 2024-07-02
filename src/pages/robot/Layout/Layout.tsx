import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Loader2 from 'src/components/ui/Loader2';

import { useRobotContext } from '../robot.context';
import WrappedActionBar from './WrappedActionBar';
import styles from './Layout.module.scss';
import useMenuCounts from './useMenuCounts';
import RobotHeader from './RobotHeader/RobotHeader';

function Layout() {
  const { address, isLoading, nickname } = useRobotContext();
  const counts = useMenuCounts(address);

  return (
    <div className={styles.wrapper}>
      <Helmet>
        <title>robot {nickname || address || ''}</title>
      </Helmet>
      <main>
        {isLoading ? (
          <Loader2 />
        ) : (
          <>
            <RobotHeader menuCounts={counts} />
            <Outlet />

            <WrappedActionBar />
          </>
        )}
      </main>
    </div>
  );
}

export default Layout;
