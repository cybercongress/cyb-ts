import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import SettingsMenu from './SettingsMenu/SettingsMenu';
import styles from './Layout.module.scss';

function Layout() {
  return (
    <div className={styles.wrapper}>
      <Helmet>
        <title>setting | cyb</title>
      </Helmet>

      <SettingsMenu />

      <Outlet />
    </div>
  );
}

export default Layout;
