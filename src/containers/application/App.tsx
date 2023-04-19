import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import { useIpfs } from 'src/contexts/ipfs';
import useGetMarketData from 'src/hooks/useGetMarketData';
import { AppDispatch, RootState } from 'src/redux/store';
import { useAppData } from 'src/contexts/appData';
import AppMenu from './AppMenu';
import { initPocket } from '../../redux/features/pocket';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import { GitHub, Telegram } from '../../components/actionBar';
import AppSideBar from './AppSideBar';
import { InfoCard } from '../portal/components';
import Header from './Header/Header';

function App() {
  const { updateMarketData, updateDataTotalSupply } = useAppData();
  const { marketData, dataTotal } = useGetMarketData();

  const { pocket } = useSelector((state: RootState) => state);
  const dispatch: AppDispatch = useDispatch();
  const { defaultAccount } = pocket;

  const { addressActive } = useSetActiveAddress(defaultAccount);
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState(false);

  const ipfs = useIpfs();

  useEffect(() => {
    if (Object.keys(marketData).length > 0) {
      updateMarketData(marketData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketData]);

  useEffect(() => {
    if (Object.keys(dataTotal).length > 0) {
      updateDataTotalSupply(dataTotal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTotal]);

  // useEffect(() => {
  //   const { pathname } = location;
  //   if (pathname.indexOf(query) === -1) {
  //     setQueryProps('');
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [location.pathname]);

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
    <div>
      <Header
        menuProps={{
          toggleMenu: () => setOpenMenu(!openMenu),
          isOpen: openMenu,
        }}
      />

      <AppSideBar openMenu={openMenu}>
        <AppMenu addressActive={addressActive} />
      </AppSideBar>

      {ipfs.error !== null && location.pathname !== '/ipfs' && (
        <div
          style={{
            width: '59%',
            maxWidth: '1000px',
            margin: '0 auto',
          }}
        >
          <Link to="/ipfs">
            <InfoCard status="red">
              <div
                style={{
                  textAlign: 'center',
                  padding: '10px 50px 0px 50px',
                  gap: 20,
                  display: 'grid',
                  color: '#fff',
                }}
              >
                <div style={{ fontSize: '28px' }}>
                  Could not connect to the IPFS API
                </div>
                <div>
                  <span style={{ color: '#36d6ae' }}>Go to ipfs page</span>
                </div>
              </div>
            </InfoCard>
          </Link>
        </div>
      )}

      <footer>
        <Telegram />
        <GitHub />
      </footer>
    </div>
  );
}

export default App;
