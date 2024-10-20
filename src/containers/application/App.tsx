import { useEffect, useMemo } from 'react';
import { Link, Outlet, matchPath, useLocation } from 'react-router-dom';

import { initPocket } from 'src/redux/features/pocket';
import MainLayout from 'src/layouts/Main';

import { getPassport } from 'src/features/passport/passports.redux';
import { useAdviser } from 'src/features/adviser/context';
import { routes } from 'src/routes';
import { AdviserColors } from 'src/features/adviser/Adviser/Adviser';
import { useBackend } from 'src/contexts/backend/backend';

import { useAppDispatch } from 'src/redux/hooks';
import useSenseManager from 'src/features/sense/ui/useSenseManager';

import { initCyblog } from 'src/utils/logging/bootstrap';

import { setTimeHistoryRoute } from 'src/features/TimeHistory/redux/TimeHistory.redux';
import { PreviousPageProvider } from 'src/contexts/previousPage';
import { cybernetRoutes } from 'src/features/cybernet/ui/routes';
import useCurrentAddress from 'src/hooks/useCurrentAddress';
import NewVersionChecker from 'src/components/NewVersionChecker/NewVersionChecker';
import useAdviserTexts from 'src/features/adviser/useAdviserTexts';
import { MainContainer } from 'src/components';
import { useDevice } from 'src/contexts/device';
import AdviserContainer from '../../features/adviser/AdviserContainer';
import styles from './styles.scss';
import { setFocus } from './Header/Commander/commander.redux';
import { mobileAllowedRoutes } from './mobileAllowedRoutes';
import UseDesktopVersionBlock from './UseDesktopVersionBlock/UseDesktopVersionBlock';

export const PORTAL_ID = 'portal';

initCyblog();

function App() {
  const dispatch = useAppDispatch();
  const address = useCurrentAddress();

  // const { community, communityLoaded } = useGetCommunity(address || null, {
  //   main: true,
  // });

  const location = useLocation();
  const adviserContext = useAdviser();
  useSenseManager();

  const { ipfsError } = useBackend();

  useEffect(() => {
    dispatch(initPocket());
  }, []);

  useEffect(() => {
    if (!address) {
      return;
    }

    dispatch(
      getPassport({
        address,
      })
    );
  }, [address, dispatch]);

  // reset
  // useEffect(() => {
  //   if (communityLoaded) {
  //     dispatch(setCommunity(community));
  //   }
  // }, [communityLoaded, community, dispatch]);

  useAdviserTexts({
    defaultText: useMemo(() => {
      return (
        <div>
          There are network issues 😔, part of functionality is currently
          disabled
          <br />
          <Link to={routes.social.path}>check socials</Link> for more info
        </div>
      );
      // 'indexer is in sync now, some data may be not fully available'
    }, []),
  });

  useEffect(() => {
    // tabs
    if (
      [cybernetRoutes.verse.path, routes.senate.routes.proposal.path].some(
        (path) => {
          return matchPath(path, location.pathname);
        }
      )
    ) {
      return;
    }

    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    dispatch(setTimeHistoryRoute(location.pathname));
  }, [location.pathname, dispatch]);

  useEffect(() => {
    if (ipfsError && !location.pathname.includes('/drive')) {
      adviserContext.setAdviser(
        <p>
          Could not connect to the IPFS API <br />
          <Link to={routes.robot.routes.drive.path}>Go to ipfs page</Link>
        </p>,
        AdviserColors.red
      );

      adviserContext.setIsOpen(true);
    }
  }, [ipfsError, location.pathname]);

  // chekEvangelism = () => {
  //   const { location } = this.props;
  //   const { search } = location;

  //   if (search.match(/thanks=/gm) && search.match(/thanks=/gm).length > 0) {
  //     const parsed = queryString.parse(search);
  //     console.log('parsed', parsed);
  //     localStorage.setItem('thanks', JSON.stringify(parsed.thanks));
  //   }
  // };

  // initial focus on commander
  useEffect(() => {
    const isGraphPages = window.location.pathname.includes('/brain');

    if (!isGraphPages) {
      dispatch(setFocus(true));
    }
  }, [dispatch]);

  const { isMobile } = useDevice();

  const mobileAllowed =
    location.pathname.includes('@') ||
    mobileAllowedRoutes.some((path) => {
      return matchPath(path, location.pathname);
    });

  return (
    <PreviousPageProvider>
      <NewVersionChecker />
      <MainLayout>
        <>
          {/* not move portal order */}
          {(location.pathname.includes('/brain') ||
            location.pathname.includes('/oracle2') ||
            location.pathname.includes('/graph')) && (
            <div id={PORTAL_ID} className={styles.portal} />
          )}

          <AdviserContainer />

          {isMobile && !mobileAllowed ? (
            <MainContainer>
              <UseDesktopVersionBlock />
            </MainContainer>
          ) : (
            <Outlet />
          )}
        </>
      </MainLayout>
    </PreviousPageProvider>
  );
}

export default App;
