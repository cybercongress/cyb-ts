import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';

import { useIpfs } from 'src/contexts/ipfs';
import { AppDispatch, RootState } from 'src/redux/store';
import { initPocket } from 'src/redux/features/pocket';
import MainLayout from 'src/layouts/Main';
import IPFSConnectError from 'src/features/ipfs/IPFSConnectError/IPFSConnectError';
import { routes } from 'src/routes';
import styles from './styles.scss';
import usePassportContract from 'src/features/passport/usePassportContract';

import { Citizenship } from 'src/types/citizenship';
import { useGetCommunity } from 'src/pages/robot/_refactor/account/hooks';
import { setCommunity } from 'src/redux/features/currentAccount';
import { getPassport } from 'src/features/passport/passports.redux';
import { useQueryClient } from 'src/contexts/queryClient';
import useCommunityPassports from 'src/features/passport/hooks/useCommunityPassports';

export const PORTAL_ID = 'portal';

function App() {
  const dispatch: AppDispatch = useDispatch();
  const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  const queryClient = useQueryClient();

  const address = defaultAccount.account?.cyber?.bech32;

  const { community } = useGetCommunity(address || null);

  useCommunityPassports();

  const location = useLocation();

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
  }, [address]);

  // reset

  useEffect(() => {
    dispatch(setCommunity(community));
  }, [community, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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

        {ipfs.error && !location.pathname.includes('/drive') && (
          <IPFSConnectError />
        )}

        <Outlet />
      </>
    </MainLayout>
  );
}

export default App;
