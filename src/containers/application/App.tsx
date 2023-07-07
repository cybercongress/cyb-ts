import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';

import { useIpfs } from 'src/contexts/ipfs';
import { AppDispatch, RootState } from 'src/redux/store';
import { initPocket } from '../../redux/features/pocket';
import MainLayout from 'src/layouts/Main';
import IPFSConnectError from './IPFSConnectError/IPFSConnectError';
import { routes } from 'src/routes';
import styles from './styles.scss';
import usePassportContract from 'src/features/passport/usePassportContract';

import {
  setPassport,
  setPassportLoading,
} from 'src/features/passport/passport.redux';
import { Citizenship } from 'src/types/citizenship';

export const PORTAL_ID = 'portal';

function App() {
  const dispatch: AppDispatch = useDispatch();
  const { defaultAccount } = useSelector((state: RootState) => state.pocket);

  const address = defaultAccount.account?.cyber?.bech32;
  const { data: passport, loading } = usePassportContract<Citizenship>({
    query: {
      active_passport: {
        address,
      },
    },
    skip: !address,
  });

  const location = useLocation();

  const ipfs = useIpfs();

  useEffect(() => {
    dispatch(initPocket());
  }, []);

  useEffect(() => {
    dispatch(setPassportLoading(loading));
  }, [loading, dispatch]);

  useEffect(() => {
    dispatch(setPassport(!defaultAccount.account ? null : passport || null));
  }, [passport, dispatch, defaultAccount]);

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
        {ipfs.error && location.pathname !== routes.ipfs.path && (
          <IPFSConnectError />
        )}

        <div id={PORTAL_ID} className={styles.portal} />

        <Outlet />
      </>
    </MainLayout>
  );
}

export default App;
