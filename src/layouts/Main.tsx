import { useEffect, useMemo, useState } from 'react';

import { localStorageKeys } from 'src/constants/localStorageKeys';
import AppMenu from 'src/containers/application/AppMenu';
import AppSideBar from 'src/containers/application/AppSideBar';
import Header from 'src/containers/application/Header/Header';
import useSetActiveAddress from 'src/hooks/useSetActiveAddress';
import { useAppSelector } from 'src/redux/hooks';
import styles from './Main.module.scss';
import { routes } from 'src/routes';
import { Link, useLocation } from 'react-router-dom';
import SenseButton from '../features/sense/ui/SenseButton/SenseButton';
import { CHAIN_ID } from 'src/constants/config';
import { Networks } from 'src/types/networks';

function MainLayout({ children }: { children: JSX.Element }) {
  const pocket = useAppSelector(({ pocket }) => pocket);
  const { defaultAccount } = pocket;

  const { addressActive } = useSetActiveAddress(defaultAccount);
  const { pathname } = useLocation();

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

      <AppSideBar
        openMenu={openMenu}
        closeMenu={() => {
          if (pathname.includes('/cyberver')) {
            return;
          }

          closeMenu();
        }}
      >
        <AppMenu
          addressActive={addressActive}
          closeMenu={() => {
            // temp until refactoring will be merged
            // prevent menu close on cybernet navigation
            if (pathname.includes('/cyberver')) {
              return;
            }

            closeMenu();
          }}
        />
      </AppSideBar>

      {CHAIN_ID === Networks.BOSTROM && (
        <SenseButton className={styles.senseBtn} />
      )}

      {children}

      <footer>
        <Link to={routes.social.path}>contacts</Link>
      </footer>
    </div>
  );
}

export default MainLayout;
