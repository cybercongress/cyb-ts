import { Outlet } from 'react-router-dom';
import TabListGoverance from './tabList';

function Layout() {
  return (
    <div>
      <TabListGoverance />
      <Outlet />
    </div>
  );
}

export default Layout;
