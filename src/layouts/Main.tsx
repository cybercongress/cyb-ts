import { useEffect, useMemo, useState } from 'react';
import { Telegram } from 'src/components/actionBar/Telegram';
import { GitHub } from 'src/components/actionBar/GitHub';
import { localStorageKeys } from 'src/constants/localStorageKeys';
import AppMenu from 'src/containers/application/AppMenu';
import AppSideBar from 'src/containers/application/AppSideBar';
import Header from 'src/containers/application/Header/Header';
import useSetActiveAddress from 'src/hooks/useSetActiveAddress';
import Discord from 'src/components/actionBar/Discord/Discord';
import Twitter from 'src/components/actionBar/Twitter/Twitter';
import { useAppSelector } from 'src/redux/hooks';
import styles from './Main.module.scss';
import { routes } from 'src/routes';
import { Link } from 'react-router-dom';

function MainLayout({ children }: { children: JSX.Element }) {
  const pocket = useAppSelector(({ pocket }) => pocket);
  const { defaultAccount } = pocket;

  const { addressActive } = useSetActiveAddress(defaultAccount);

  // for new user show menu, else no + animation
  const [openMenu, setOpenMenu] = useState(
    !localStorage.getItem(localStorageKeys.MENU_SHOW)
  );

  function toggleMenu(isOpen: boolean) {
    const newState = isOpen;

    setOpenMenu(newState);
    localStorage.setItem(localStorageKeys.MENU_SHOW, newState.toString());
  }

  // for initial animation
  useEffect(() => {
    const isMenuOpenPreference = localStorage.getItem(
      localStorageKeys.MENU_SHOW
    );

    const timeout = setTimeout(() => {
      toggleMenu(isMenuOpenPreference === 'true');
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  function closeMenu() {
    toggleMenu(false);
  }

  return (
    <div className={styles.wrapper}>
      <Header
        menuProps={{
          toggleMenu: useMemo(() => () => toggleMenu(!openMenu), [openMenu]),
          isOpen: openMenu,
        }}
      />

      <AppSideBar openMenu={openMenu} closeMenu={closeMenu}>
        <AppMenu addressActive={addressActive} closeMenu={closeMenu} />
      </AppSideBar>

      {children}
    </div>
  );
}

export default MainLayout;
