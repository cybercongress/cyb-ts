import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';

import { useIpfs } from 'src/contexts/ipfs';
import { AppDispatch } from 'src/redux/store';
import { initPocket } from '../../redux/features/pocket';
import MainLayout from 'src/layouts/Main';
import IPFSConnectError from './IPFSConnectError/IPFSConnectError';
import { routes } from 'src/routes';

function App() {
  const dispatch: AppDispatch = useDispatch();

  const location = useLocation();

  const ipfs = useIpfs();

  useEffect(() => {
    dispatch(initPocket());
  }, []);

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

        <Outlet />
      </>
    </MainLayout>
  );
}

export default App;
