import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Loader2 from 'src/components/ui/Loader2';

import RobotHeader from './RobotHeader/RobotHeader';
import { useRobotContext } from '../robot.context';
import WrappedActionBar from './WrappedActionBar';
import styles from './Layout.module.scss';

function Layout() {
  const { address, isLoading, nickname } = useRobotContext();

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
            <RobotHeader />

            <Outlet />

            <WrappedActionBar />
          </>
        )}
      </main>
    </div>
  );
}

export default Layout;
