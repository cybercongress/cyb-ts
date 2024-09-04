import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MainContainer } from 'src/components';
import SettingsMenu from './SettingsMenu/SettingsMenu';
import styles from './Layout.module.scss';

function Layout() {
  return (
    <MainContainer>
      <div className={styles.wrapper}>
        <Helmet>
          <title>setting | cyb</title>
        </Helmet>

        <SettingsMenu />

        <Outlet />
      </div>
    </MainContainer>
  );
}

export default Layout;
