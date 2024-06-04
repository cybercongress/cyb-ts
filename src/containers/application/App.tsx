import { useEffect } from 'react';
import { Link, Outlet, matchPath, useLocation } from 'react-router-dom';

import { AppDispatch } from 'src/redux/store';
import { initPocket, selectCurrentAddress } from 'src/redux/features/pocket';
import MainLayout from 'src/layouts/Main';

import { useGetCommunity } from 'src/pages/robot/_refactor/account/hooks';
import { setCommunity } from 'src/redux/features/currentAccount';
import { getPassport } from 'src/features/passport/passports.redux';
import { useQueryClient } from 'src/contexts/queryClient';
import { useAdviser } from 'src/features/adviser/context';
import { routes } from 'src/routes';
import { AdviserColors } from 'src/features/adviser/Adviser/Adviser';
import { useBackend } from 'src/contexts/backend/backend';
import AdviserContainer from '../../features/adviser/AdviserContainer';

import styles from './styles.scss';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import useSenseManager from 'src/features/sense/ui/useSenseManager';

// eslint-disable-next-line unused-imports/no-unused-imports, @typescript-eslint/no-unused-vars
import { initCyblog } from 'src/utils/logging/bootstrap';
import { PreviousPageProvider } from 'src/contexts/previousPage';
import { cybernetRoutes } from 'src/features/cybernet/ui/routes';

export const PORTAL_ID = 'portal';

initCyblog();

function App() {
  const dispatch: AppDispatch = useAppDispatch();
  const { defaultAccount } = useAppSelector((state) => state.pocket);
  const queryClient = useQueryClient();

  const address = defaultAccount.account?.cyber?.bech32;
  // cyblog.info('TEST!!!!');
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
    if (!address || !queryClient) {
      return;
    }
    dispatch(
      getPassport({
        address,
        queryClient,
      })
    );
  }, [address, queryClient, dispatch]);

  // reset

  // useEffect(() => {
  //   if (communityLoaded) {
  //     dispatch(setCommunity(community));
  //   }
  // }, [communityLoaded, community, dispatch]);

  useEffect(() => {
    // tabs
    if (matchPath(routes.senateProposal.path, location.pathname)) {
      return;
    }

    window.scrollTo(0, 0);
  }, [location.pathname]);

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

  return (
    <PreviousPageProvider>
      <MainLayout>
        <>
          {/* not move portal order */}
          {(location.pathname.includes('/brain') ||
            location.pathname.includes('/oracle2') ||
            location.pathname.includes('/graph')) && (
            <div id={PORTAL_ID} className={styles.portal} />
          )}

          {!(
            ['/'].includes(location.pathname) ||
            matchPath(cybernetRoutes.verse.path, location.pathname)
          ) && <AdviserContainer />}

          <Outlet />
        </>
      </MainLayout>
    </PreviousPageProvider>
  );
}

export default App;
