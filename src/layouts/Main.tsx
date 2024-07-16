import { useEffect, useMemo, useRef, useState } from 'react';

import { localStorageKeys } from 'src/constants/localStorageKeys';
import Header from 'src/containers/application/Header/Header';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { routes } from 'src/routes';
import { useDevice } from 'src/contexts/device';
import { setFocus } from 'src/containers/application/Header/Commander/commander.redux';
import CyberlinksGraphContainer from 'src/features/cyberlinks/CyberlinksGraph/CyberlinksGraphContainer';
import HydrogenBalance from 'src/components/HydrogenBalance/HydrogenBalance';
import TimeFooter from 'src/features/TimeFooter/TimeFooter';
import { Networks } from 'src/types/networks';
import { CHAIN_ID } from 'src/constants/config';
import { Link } from 'react-router-dom';
import CircularMenu from 'src/components/appMenu/CircularMenu';
import TimeHistory from 'src/features/TimeHistory/TimeHistory';
import graphDataPrepared from '../pages/oracle/landing/graphDataPrepared.json';
import stylesOracle from '../pages/oracle/landing/OracleLanding.module.scss';
import SenseButton from '../features/sense/ui/SenseButton/SenseButton';
import styles from './Main.module.scss';
import MobileMenu from 'src/components/appMenu/MobileMenu';

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

  return (
    <div className={styles.wrapper} ref={ref}>
      <Header
        menuProps={{
          toggleMenu: useMemo(() => () => toggleMenu(!openMenu), [openMenu]),
          isOpen: openMenu,
        }}
      />

      {CHAIN_ID === Networks.BOSTROM && <SenseButton />}
      <HydrogenBalance address={addressBech32} />

      {children}
      <footer>
        {isMobile ? <MobileMenu /> : <CircularMenu circleSize={graphSize} />}
        {!isMobile && (
          <Link
            to={routes.brain.path}
            className={stylesOracle.graphWrapper}
            style={{ bottom: '0px' }}
          >
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
        {/* <ActionBar /> */}

        <div className={styles.Time}>
          <TimeHistory />
          <TimeFooter />
        </div>
        {/* <Link to={routes.social.path}>contacts</Link> */}
      </footer>
    </div>
  );
}

export default MainLayout;
