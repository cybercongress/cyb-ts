import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Telegram, GitHub } from 'src/components/actionBar';
import { localStorageKeys } from 'src/constants/localStorageKeys';
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

  useEffect(() => {
    if (!localStorage.getItem(localStorageKeys.MENU_SHOWED)) {
      setTimeout(() => {
        setOpenMenu(true);
        localStorage.setItem(localStorageKeys.MENU_SHOWED, 'true');
      }, 700);
    }
  }, []);

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
