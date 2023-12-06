import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import s from './Layout.module.scss';
import TabList from '../../components/tabList/TabList';
import { TypePages } from '../../type';

function Layout() {
  const location = useLocation();
  const [active, setActive] = useState<TypePages | undefined>(TypePages.swap);

  useEffect(() => {
    const locationSplit = location.pathname.replace(/^\/|\/$/g, '').split('/');
    setActive(
      Object.values(TypePages).find((item) => item === locationSplit[1])
    );
  }, [location]);

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
