import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Telegram, GitHub } from 'src/components/actionBar';
import AppMenu from 'src/containers/application/AppMenu';
import AppSideBar from 'src/containers/application/AppSideBar';
import Header from 'src/containers/application/Header/Header';
import useSetActiveAddress from 'src/hooks/useSetActiveAddress';
import { RootState } from 'src/redux/store';

function MainLayout({ children }: { children: JSX.Element }) {
  const { pocket } = useSelector((state: RootState) => state);
  const { defaultAccount } = pocket;

  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div>
      <Header
        menuProps={{
          toggleMenu: () => setOpenMenu(!openMenu),
          isOpen: openMenu,
        }}
      />

      <AppSideBar openMenu={openMenu}>
        <AppMenu addressActive={addressActive} />
      </AppSideBar>

      {children}

      <footer>
        <Telegram />
        <GitHub />
      </footer>
    </div>
  );
}

export default MainLayout;
