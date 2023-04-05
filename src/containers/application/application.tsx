import { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import useIpfs from 'src/hooks/useIpfs';
import AppMenu from './AppMenu';
import { setTypeDevice } from '../../redux/actions/settings';
import { setDefaultAccount, setAccounts } from '../../redux/actions/pocket';
import { AppContext } from '../../context';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import useGetMarketData from '../nebula/useGetMarketData';
import { GitHub, Telegram } from '../../components/actionBar';
import AppSideBar from './AppSideBar';
import useIsMobileTablet from '../../hooks/useIsMobileTablet';
import { InfoCard } from '../portal/components';
import Header from './Header/Header';

function App({
  pocket,
  setAccountsProps,
  setDefaultAccountProps,
  setTypeDeviceProps,
}) {
  const { updatetMarketData, updateDataTotalSupply } = useContext(AppContext);
  const { marketData, dataTotal } = useGetMarketData();
  const { isMobile } = useIsMobileTablet();

  const { defaultAccount } = pocket;

  const { addressActive } = useSetActiveAddress(defaultAccount);
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState(false);

  const ipfs = useIpfs();

  useEffect(() => {
    setTypeDeviceProps(isMobile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  useEffect(() => {
    if (Object.keys(marketData).length > 0) {
      updatetMarketData(marketData);
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
    const checkAddressLocalStorage = async () => {
      const { account } = defaultAccount;
      // console.log(`!!! ===> 96 useEffect checkAddressLocalStorage`, account);
      if (account === null) {
        let defaultAccounts = null;
        let defaultAccountsKeys = null;
        let accountsTemp = null;

        const localStoragePocketAccount = await localStorage.getItem(
          'pocketAccount'
        );
        const localStoragePocket = localStorage.getItem('pocket');
        if (localStoragePocket !== null) {
          const localStoragePocketData = JSON.parse(localStoragePocket);
          const keyPocket = Object.keys(localStoragePocketData)[0];
          const accountPocket = Object.values(localStoragePocketData)[0];
          defaultAccounts = accountPocket;
          defaultAccountsKeys = keyPocket;
        }
        if (localStoragePocketAccount !== null) {
          const localStoragePocketAccountData = JSON.parse(
            localStoragePocketAccount
          );
          if (localStoragePocket === null) {
            const keys0 = Object.keys(localStoragePocketAccountData)[0];
            localStorage.setItem(
              'pocket',
              JSON.stringify({ [keys0]: localStoragePocketAccountData[keys0] })
            );
            defaultAccounts = localStoragePocketAccountData[keys0];
            defaultAccountsKeys = keys0;
          } else {
            accountsTemp = {
              [defaultAccountsKeys]:
                localStoragePocketAccountData[defaultAccountsKeys],
              ...localStoragePocketAccountData,
            };
          }
        } else {
          localStorage.removeItem('pocket');
          localStorage.removeItem('pocketAccount');
        }
        setDefaultAccountProps(defaultAccountsKeys, defaultAccounts);
        setAccountsProps(accountsTemp);
      }
    };
    checkAddressLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <>
      <div>
        <Header
          menuProps={{
            toggleMenu: () => setOpenMenu(!openMenu),
            isOpen: openMenu,
          }}
        />
        <div className="container-distribution">
          <AppSideBar
            onCloseSidebar={() => setOpenMenu(false)}
            openMenu={openMenu}
          >
            <AppMenu addressActive={addressActive} />
          </AppSideBar>
        </div>
      </div>
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

      <Telegram />
      <GitHub />
    </>
  );
}

const mapStateToProps = (store) => {
  return {
    mobile: store.settings.mobile,
    pocket: store.pocket,
  };
};

const mapDispatchprops = (dispatch) => {
  return {
    setDefaultAccountProps: (name, account) =>
      dispatch(setDefaultAccount(name, account)),
    setAccountsProps: (accounts) => dispatch(setAccounts(accounts)),
    setTypeDeviceProps: (type) => dispatch(setTypeDevice(type)),
  };
};

export default connect(mapStateToProps, mapDispatchprops)(App);
