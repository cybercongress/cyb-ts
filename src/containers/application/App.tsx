import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { AppDispatch, RootState } from 'src/redux/store';
import { initPocket, selectCurrentAddress } from 'src/redux/features/pocket';
import MainLayout from 'src/layouts/Main';

import { useGetCommunity } from 'src/pages/robot/_refactor/account/hooks';
import { setCommunity } from 'src/redux/features/currentAccount';
import { getPassport } from 'src/features/passport/passports.redux';
import { useQueryClient } from 'src/contexts/queryClient';
import { useAdviser } from 'src/features/adviser/context';
import { routes } from 'src/routes';
import { AdviserColors } from 'src/features/adviser/Adviser/Adviser';
import { useBackend } from 'src/contexts/backend';
import AdviserContainer from '../../features/adviser/AdviserContainer';

import styles from './styles.scss';
import { useAppSelector } from 'src/redux/hooks';

export const PORTAL_ID = 'portal';

function App() {
  const dispatch: AppDispatch = useDispatch();
  const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  const queryClient = useQueryClient();

  const address = defaultAccount.account?.cyber?.bech32;

  const { community } = useGetCommunity(address || null);
  const location = useLocation();
  const adviserContext = useAdviser();
  const myAddress = useAppSelector(selectCurrentAddress);

  const { ipfsError, isReady, senseApi } = useBackend();

  // TODO: TMP Example of how to use SENSE
  useEffect(() => {
    (async () => {
      if (isReady && senseApi && myAddress) {
        console.log('----sense ', isReady, senseApi);

        const list = await senseApi.getList();
        console.log('----sense list', list);
        const summary = await senseApi.getSummary();
        console.log('----sense summary', summary);
        const links = await senseApi.getLinks(
          'QmVrZci1LVijze8ZwFQQWLMBDwC3qUUZw16j7uWopV2Krb'
        );
        console.log('----sense links', links);
        const transactionsMy = await senseApi.getTransactions(
          'bostrom1uj85l9uar80s342nw5uqjrnvm3zlzsd0392dq3'
        );
        console.log('----sense transactionsMy', transactionsMy);

        const transactionsFriend = await senseApi.getTransactions(
          'bostrom1d8754xqa9245pctlfcyv8eah468neqzn3a0y0t'
        );
        console.log('----sense transactionsFriend master', transactionsFriend);

        const chats = await senseApi.getMyChats(
          myAddress,
          'bostrom1d8754xqa9245pctlfcyv8eah468neqzn3a0y0t'
        );
        console.log('----sense chats', chats);
        // MARK AS READ
        // await senseApi.markAsRead('<CID/ADDRESS');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, senseApi, myAddress]);

  /// ------------

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
    <MainLayout>
      <>
        {/* not move portal order */}
        {(location.pathname.includes('/brain') ||
          location.pathname.includes('/oracle2') ||
          location.pathname.includes('/graph')) && (
          <div id={PORTAL_ID} className={styles.portal} />
        )}

        {!(location.pathname === '/') && <AdviserContainer />}

        <Outlet />
      </>
    </MainLayout>
  );
}

export default App;
