import { Outlet } from 'react-router-dom';
import styles from './Layout.module.scss';
import TabListTeleport from '../components/tabList/TabList';

function Layout() {
  return (
    <div>
      <header className={styles.header}>
        <TabListTeleport />
      </header>

      <Outlet />
    </div>
  );
}

export default Layout;
