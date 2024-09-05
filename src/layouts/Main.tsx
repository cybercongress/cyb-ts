import { useEffect, useRef, useState } from 'react';
import Header from 'src/containers/application/Header/Header';
import { useAppDispatch } from 'src/redux/hooks';
import { routes } from 'src/routes';
import { useDevice } from 'src/contexts/device';
import { setFocus } from 'src/containers/application/Header/Commander/commander.redux';
import CyberlinksGraphContainer from 'src/features/cyberlinks/CyberlinksGraph/CyberlinksGraphContainer';
import TimeFooter from 'src/features/TimeFooter/TimeFooter';
import { Networks } from 'src/types/networks';
import { CHAIN_ID } from 'src/constants/config';
import { Link } from 'react-router-dom';
import CircularMenu from 'src/components/appMenu/CircularMenu/CircularMenu';
import TimeHistory from 'src/features/TimeHistory/TimeHistory';
import MobileMenu from 'src/components/appMenu/MobileMenu/MobileMenu';
import useCurrentAddress from 'src/hooks/useCurrentAddress';
import { BrainBtn } from 'src/pages/oracle/landing/OracleLanding';
import graphDataPrepared from '../pages/oracle/landing/graphDataPrepared.json';
import stylesOracle from '../pages/oracle/landing/OracleLanding.module.scss';
import SenseButton from '../features/sense/ui/SenseButton/SenseButton';
import styles from './Main.module.scss';
import SideHydrogenBtn from './ui/SideHydrogenBtn/SideHydrogenBtn';

function MainLayout({ children }: { children: JSX.Element }) {
  const currentAddress = useCurrentAddress();
  const { viewportWidth } = useDevice();
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const [isRenderGraph, setIsRenderGraph] = useState(false);

  const graphSize = Math.min(viewportWidth * 0.13, 220);
  const isMobile =
    viewportWidth <= Number(stylesOracle.mobileBreakpoint.replace('px', ''));

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

  const link = currentAddress
    ? routes.robot.routes.brain.path
    : routes.brain.path;

  return (
    <div className={styles.wrapper} ref={ref}>
      <Header />

      {currentAddress && !isMobile && (
        <>
          {CHAIN_ID === Networks.BOSTROM && !isMobile && <SenseButton />}
          <SideHydrogenBtn />
        </>
      )}

      {children}
      <footer>
        {isMobile ? <MobileMenu /> : <CircularMenu circleSize={graphSize} />}
        {!isMobile && (
          <Link
            to={link}
            className={stylesOracle.graphWrapper}
            style={{ bottom: '0px' }}
          >
            <BrainBtn />

            {isRenderGraph && (
              <CyberlinksGraphContainer
                size={graphSize}
                type="3d"
                data={graphDataPrepared}
              />
            )}
          </Link>
        )}
        <div className={styles.Time}>
          {!isMobile && <TimeHistory />}
          <TimeFooter />
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
