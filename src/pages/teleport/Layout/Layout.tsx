import { Outlet } from 'react-router-dom';
import styles from './Layout.module.scss';
import TabListTeleport from '../components/tabList/TabList';
import { Stars } from 'src/containers/portal/components';

function Layout() {
  return (
    <div>
      <Stars />

      <header className={styles.header}>
        <TabListTeleport />
      </header>

      <Outlet />
    </div>
  );
}

export default Layout;
