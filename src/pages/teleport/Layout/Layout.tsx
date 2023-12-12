import { Outlet, useLocation } from 'react-router-dom';
import s from './Layout.module.scss';
import TabList from '../components/tabList/TabList';
import { TypePages } from '../type';

function Layout() {
  const location = useLocation();
  const locationSplit = location.pathname.replace(/^\/|\/$/g, '').split('/');
  const active = Object.values(TypePages).find(
    (item) => item === locationSplit[1]
  );

  return (
    <div>
      {active && (
        <header className={s.header}>
          <TabList selected={active} />
        </header>
      )}
      <Outlet />
    </div>
  );
}

export default Layout;
