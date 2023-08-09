import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { useIpfs } from 'src/contexts/ipfs';
import { AppDispatch, RootState } from 'src/redux/store';
import { initPocket } from 'src/redux/features/pocket';
import MainLayout from 'src/layouts/Main';
import styles from './styles.scss';

import { useGetCommunity } from 'src/pages/robot/_refactor/account/hooks';
import { setCommunity } from 'src/redux/features/currentAccount';
import { getPassport } from 'src/features/passport/passports.redux';
import { useQueryClient } from 'src/contexts/queryClient';
import useCommunityPassports from 'src/features/passport/hooks/useCommunityPassports';
import { useAdviser } from 'src/features/adviser/context';
import { routes } from 'src/routes';
import { AdviserColors } from 'src/features/adviser/Adviser/Adviser';
import AdviserContainer from '../../features/adviser/AdviserContainer';

export const PORTAL_ID = 'portal';

function App() {
  const dispatch: AppDispatch = useDispatch();
  const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  const queryClient = useQueryClient();

  const address = defaultAccount.account?.cyber?.bech32;

  const { community } = useGetCommunity(address || null);

  useCommunityPassports();

  const location = useLocation();
  const adviserContext = useAdviser();

  const ipfs = useIpfs();

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

  useEffect(() => {
    dispatch(setCommunity(community));
  }, [community, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (ipfs.error && !location.pathname.includes('/drive')) {
      adviserContext.setAdviser(
        <p>
          Could not connect to the IPFS API <br />
          <Link to={routes.robot.routes.drive.path}>Go to ipfs page</Link>
        </p>,
        AdviserColors.red
      );

      adviserContext.setIsOpen(true);
    }
  }, [ipfs.error, location.pathname]);

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
    <MainLayout>
      <>
        {/* not move portal order */}
        {location.pathname.includes('/brain') && (
          <div id={PORTAL_ID} className={styles.portal} />
        )}

        <AdviserContainer />

        <Outlet />
      </>
    </MainLayout>
  );
}

export default App;
