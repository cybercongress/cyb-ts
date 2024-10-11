import { Outlet } from 'react-router-dom';
import styles from './Layout.module.scss';
import TabListTeleport from '../components/tabList/TabList';
import { Stars } from 'src/containers/portal/components';
import useAdviserTexts from 'src/features/adviser/useAdviserTexts';

function Layout() {
  useAdviserTexts({
    defaultText: 'welcome to teleport',
  });

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
