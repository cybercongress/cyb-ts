import { Link, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Loader2 from 'src/components/ui/Loader2';
import useMenuCounts from './useMenuCounts';

import RobotHeader from './RobotHeader/RobotHeader';
import { useRobotContext } from '../robot.context';
import WrappedActionBar from './WrappedActionBar';
import styles from './Layout.module.scss';
import RobotMenu from './RobotMenu/RobotMenu';
import itemsMenu from 'src/utils/appsMenu';

function Layout() {
  const { address, isOwner, isLoading, nickname } = useRobotContext();

  const counts = useMenuCounts(address);

  return (
    <div className={styles.wrapper}>
      <Helmet>
        <title>robot {nickname || address || ''}</title>
      </Helmet>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          height: 'calc(100vh - 220px - 120px)',
          maxHeight: '640px',
        }}
      >
        {itemsMenu().map((item) => {
          return (
            <Link
              to={item.to}
              key={item.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
              }}
            >
              <img alt={item.name} src={item.icon} style={{ width: '40px' }} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
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
      <div style={{ display: 'flex', gap: '5px' }}>
        <RobotMenu counts={counts} />
        <RobotMenu counts={counts} isRight />
      </div>
    </div>
  );
}

export default Layout;
