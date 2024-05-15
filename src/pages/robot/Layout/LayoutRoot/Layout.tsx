import { Outlet } from 'react-router-dom';
import styles from './Layout.module.scss';
import { useRobotContext } from '../../robot.context';
import RootMenu from './RootMenu/RootMenu';
import useMenuCounts from '../useMenuCounts';

function Layout() {
  const { address } = useRobotContext();
  const counts = useMenuCounts(address);

  return (
    <div className={styles.wrapper}>
      <RootMenu counts={counts} />

      <Outlet />
    </div>
  );
}

export default Layout;
