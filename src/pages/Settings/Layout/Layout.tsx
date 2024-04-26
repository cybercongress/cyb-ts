import { Outlet } from 'react-router-dom';
import SettingsMenu from './SettingsMenu/SettingsMenu';

function Layout() {
  return (
    <div>
      <SettingsMenu />

      <Outlet />
    </div>
  );
}

export default Layout;
