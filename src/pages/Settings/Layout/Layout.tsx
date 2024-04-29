import { Outlet } from 'react-router-dom';
import SettingsMenu from './SettingsMenu/SettingsMenu';
import styles from './Layout.module.scss';

function Layout() {
  return (
    <div className={styles.wrapper}>
      <SettingsMenu />

      <Outlet />
    </div>
  );
}

export default Layout;
