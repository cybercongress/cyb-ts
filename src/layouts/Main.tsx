import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Telegram } from 'src/components/actionBar/Telegram';
import { GitHub } from 'src/components/actionBar/GitHub';
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

  function toggleMenu(isOpen: boolean) {
    const newState = isOpen;

    setOpenMenu(newState);
    localStorage.setItem(localStorageKeys.MENU_SHOW, newState.toString());
  }

  useEffect(() => {
    // for animation
    if (localStorage.getItem(localStorageKeys.MENU_SHOW) !== 'false') {
      toggleMenu(true);
    }
  }, []);

  return (
    <div>
      <Header
        menuProps={{
          toggleMenu: useMemo(() => () => toggleMenu(!openMenu), [openMenu]),
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
