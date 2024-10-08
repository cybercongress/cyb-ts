import { useEffect, useRef, useState } from 'react';
import Header from 'src/containers/application/Header/Header';
import { routes } from 'src/routes';
import { useDevice } from 'src/contexts/device';
import CyberlinksGraphContainer from 'src/features/cyberlinks/CyberlinksGraph/CyberlinksGraphContainer';
import TimeFooter from 'src/features/TimeFooter/TimeFooter';
import { Networks } from 'src/types/networks';
import { CHAIN_ID } from 'src/constants/config';
import { Link } from 'react-router-dom';
import CircularMenu from 'src/components/appMenu/CircularMenu/CircularMenu';
import TimeHistory from 'src/features/TimeHistory/TimeHistory';
import MobileMenu from 'src/components/appMenu/MobileMenu/MobileMenu';
import useCurrentAddress from 'src/hooks/useCurrentAddress';
import graphDataPrepared from '../pages/oracle/landing/graphDataPrepared.json';
import stylesOracle from '../pages/oracle/landing/OracleLanding.module.scss';
import SenseButton from '../features/sense/ui/SenseButton/SenseButton';
import styles from './Main.module.scss';
import SideHydrogenBtn from './ui/SideHydrogenBtn/SideHydrogenBtn';

// TODO: seems merge with App.tsx, not reusing
function MainLayout({ children }: { children: JSX.Element }) {
  const currentAddress = useCurrentAddress();
  const { viewportWidth } = useDevice();
  const ref = useRef<HTMLDivElement>(null);
  const [isRenderGraph, setIsRenderGraph] = useState(false);

  const graphSize = Math.min(viewportWidth * 0.13, 220);
  const isMobile =
    viewportWidth <= Number(stylesOracle.mobileBreakpoint.replace('px', ''));

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsRenderGraph(true);
    }, 1000 * 1.5);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

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
        <div className={styles.widgetWrapper}>
          {CHAIN_ID === Networks.BOSTROM && <SenseButton />}
          <SideHydrogenBtn />
        </div>
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
            {isRenderGraph && (
              <CyberlinksGraphContainer
                size={graphSize}
                minVersion
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
