import { useEffect, useMemo, useRef, useState } from 'react';

import { localStorageKeys } from 'src/constants/localStorageKeys';
import AppMenu from 'src/containers/application/AppMenu';
import AppSideBar from 'src/containers/application/AppSideBar';
import Header from 'src/containers/application/Header/Header';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { routes } from 'src/routes';
import { Link } from 'react-router-dom';
import Commander from 'src/containers/application/Header/Commander/Commander';
import { useDevice } from 'src/contexts/device';
import { setFocus } from 'src/containers/application/Header/Commander/commander.redux';
import CyberlinksGraphContainer from 'src/features/cyberlinks/CyberlinksGraph/CyberlinksGraphContainer';
import { Time } from 'src/components';
import HydrogenBalance from 'src/components/HydrogenBalance/HydrogenBalance';
import graphDataPrepared from '../pages/oracle/landing/graphDataPrepared.json';
import stylesOracle from '../pages/oracle/landing/OracleLanding.module.scss';
import SenseButton from '../features/sense/ui/SenseButton/SenseButton';
import styles from './Main.module.scss';

function MainLayout({ children }: { children: JSX.Element }) {
  const { defaultAccount } = useAppSelector(({ pocket }) => pocket);
  const addressBech32 = defaultAccount.account?.cyber.bech32;
  const { viewportWidth } = useDevice();
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const [isRenderGraph, setIsRenderGraph] = useState(false);

  const graphSize = 220;
  const isMobile =
    viewportWidth <= Number(stylesOracle.mobileBreakpoint.replace('px', ''));

  // for new user show menu, else no + animation
  const [openMenu, setOpenMenu] = useState(
    !localStorage.getItem(localStorageKeys.MENU_SHOW)
  );

  function toggleMenu(isOpen: boolean) {
    const newState = isOpen;

    setOpenMenu(newState);
    localStorage.setItem(localStorageKeys.MENU_SHOW, newState.toString());
  }

  useEffect(() => {
    dispatch(setFocus(true));

    const timeout = setTimeout(() => {
      setIsRenderGraph(true);
    }, 1000 * 1.5);

    return () => {
      clearTimeout(timeout);
    };
  }, [dispatch]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.style.setProperty('--graph-size', `${graphSize}px`);
  }, [ref, graphSize]);

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
    <div className={styles.wrapper} ref={ref}>
      <Header
        menuProps={{
          toggleMenu: useMemo(() => () => toggleMenu(!openMenu), [openMenu]),
          isOpen: openMenu,
        }}
      />

      <AppSideBar openMenu={openMenu} closeMenu={closeMenu}>
        <AppMenu closeMenu={closeMenu} />
      </AppSideBar>

      <SenseButton className={styles.senseBtn} />
      <HydrogenBalance className={styles.hydrogenBtn} address={addressBech32} />

      {children}

      <footer>
        {!isMobile && (
          <Link to={routes.brain.path} className={stylesOracle.graphWrapper}>
            {/* <Link
              to={routes.brain.path}
              className={stylesOracle.enlargeBtn}
              title="open full graph"
            /> */}

            {isRenderGraph && (
              <CyberlinksGraphContainer
                size={graphSize}
                data={graphDataPrepared}
              />
            )}
          </Link>
        )}
        <div
          style={{
            width: '62%',
            position: 'fixed',
            left: '50%',
            bottom: '20px',
            transform: 'translate(-50%, -20px)',
            maxWidth: '1000px',
          }}
        >
          <Commander />
        </div>
        <div className={styles.Time}>
          <Time />
        </div>
        {/* <Link to={routes.social.path}>contacts</Link> */}
      </footer>
    </div>
  );
}

export default MainLayout;
