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
import styles from './Main.module.scss';
import { useDevice } from 'src/contexts/device';
import Discord from 'src/components/actionBar/Discord/Discord';
import Twitter from 'src/components/actionBar/Twitter/Twitter';

function MainLayout({ children }: { children: JSX.Element }) {
  const { pocket } = useSelector((state: RootState) => state);
  const { defaultAccount } = pocket;
  const { isMobile } = useDevice();

  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [openMenu, setOpenMenu] = useState(false);

  function toggleMenu(isOpen: boolean) {
    const newState = isOpen;

    setOpenMenu(newState);
    localStorage.setItem(localStorageKeys.MENU_SHOW, newState.toString());
  }

  useEffect(() => {
    // for animation
    if (
      localStorage.getItem(localStorageKeys.MENU_SHOW) !== 'false' &&
      !isMobile
    ) {
      toggleMenu(true);
    }
  }, [isMobile]);

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

      <footer>
        <Telegram />
        <Discord />
        <Twitter />
        <GitHub />
      </footer>
    </div>
  );
}

export default MainLayout;
