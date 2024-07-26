import { Outlet } from 'react-router-dom';
import cx from 'classnames';
import Loader2 from 'src/components/ui/Loader2';
import styles from './Layout.module.scss';
import { useRobotContext } from '../../robot.context';
import RootMenu from './RootMenu/RootMenu';
import useMenuCounts from '../useMenuCounts';
import RobotHeader from '../RobotHeader/RobotHeader';

function Layout() {
  const { address, isLoading, isOwner } = useRobotContext();
  const counts = useMenuCounts(address);

  return (
    <div className={styles.wrapper}>
      {isLoading ? (
        <Loader2 />
      ) : (
        <>
          {isOwner && <RobotHeader menuCounts={counts} />}

          <div className={cx(styles.content, { [styles.NotOwner]: !isOwner })}>
            <RootMenu counts={counts} />

            <Outlet />
          </div>
        </>
      )}
    </div>
  );
}

export default Layout;
