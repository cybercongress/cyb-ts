import { useEffect, useState, useRef, useContext } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Input } from '../../components';
import AppMenu from './AppMenu';
import Electricity from '../home/electricity';
import { setBandwidth } from '../../redux/actions/bandwidth';
import { setTypeDevice } from '../../redux/actions/settings';
import { setDefaultAccount, setAccounts } from '../../redux/actions/pocket';
import { setQuery } from '../../redux/actions/query';
import {
  convertResources,
  coinDecimals,
  reduceBalances,
  replaceSlash,
  encodeSlash,
} from '../../utils/utils';
import { AppContext } from '../../context';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import SwichNetwork from './swichNetwork';
import useGetMarketData from '../nebula/useGetMarketData';
import { GitHub, Telegram } from '../../components/actionBar';
import AppSideBar from './AppSideBar';
import SwichAccount from './swichAccount';
import useIsMobileTablet from '../../hooks/useIsMobileTablet';

function App({
  defaultAccount,
  query,
  bandwidth,
  accounts,
  setQueryProps,
  setAccountsProps,
  setDefaultAccountProps,
  setBandwidthProps,
  children,
  setTypeDeviceProps,
}) {
  const { jsCyber, updatetMarketData, updateDataTotalSupply } =
    useContext(AppContext);
  const { marketData, dataTotal } = useGetMarketData();
  const { isMobile } = useIsMobileTablet();

  const { addressActive } = useSetActiveAddress(defaultAccount);
  const textInput = useRef();
  const history = useHistory();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);
  const [countLink, setCountLink] = useState(0);
  const [priceLink, setPriceLink] = useState(0.25);
  const [amounPower, setAmounPower] = useState(0);

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

  useEffect(() => {
    const { pathname } = location;
    if (pathname.indexOf(query) === -1) {
      setQueryProps('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    const getPrice = async () => {
      if (jsCyber !== null) {
        const response = await jsCyber.price();
        setPriceLink(coinDecimals(response.price.dec));
      }
    };
    getPrice();
  }, [jsCyber]);

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

  useEffect(() => {
    const getBandwidth = async () => {
      try {
        const { account } = defaultAccount;
        console.log(`account getBandwidth`, account);
        if (
          account !== null &&
          Object.prototype.hasOwnProperty.call(account, 'cyber') &&
          jsCyber !== null
        ) {
          const { bech32: cyberBech32 } = account.cyber;
          const responseAccountBandwidth = await jsCyber.accountBandwidth(
            cyberBech32
          );

          if (
            responseAccountBandwidth !== null &&
            responseAccountBandwidth.neuronBandwidth
          ) {
            const { maxValue, remainedValue } =
              responseAccountBandwidth.neuronBandwidth;
            setBandwidthProps(remainedValue, maxValue);
            setCountLink(remainedValue / (priceLink * 1000));
          } else {
            setBandwidthProps(0, 0);
            setCountLink(0);
          }
        } else {
          setBandwidthProps(0, 0);
          setCountLink(0);
        }
      } catch (error) {
        setBandwidthProps(0, 0);
        setCountLink(0);
      }
    };
    getBandwidth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAccount, location.pathname, priceLink, jsCyber]);

  useEffect(() => {
    const getAmounPower = async () => {
      try {
        const { account } = defaultAccount;
        if (
          account !== null &&
          Object.prototype.hasOwnProperty.call(account, 'cyber') &&
          jsCyber !== null
        ) {
          const { bech32 } = account.cyber;
          const allBalances = await jsCyber.getAllBalances(bech32);
          const reduceallBalances = reduceBalances(allBalances);
          if (reduceallBalances.milliampere && reduceallBalances.millivolt) {
            const { milliampere, millivolt } = reduceallBalances;
            setAmounPower(
              convertResources(milliampere) * convertResources(millivolt)
            );
          }
        } else {
          setAmounPower(0);
        }
      } catch (error) {
        setAmounPower(0);
      }
    };
    getAmounPower();
  }, [jsCyber, defaultAccount]);

  // chekEvangelism = () => {
  //   const { location } = this.props;
  //   const { search } = location;

  //   if (search.match(/thanks=/gm) && search.match(/thanks=/gm).length > 0) {
  //     const parsed = queryString.parse(search);
  //     console.log('parsed', parsed);
  //     localStorage.setItem('thanks', JSON.stringify(parsed.thanks));
  //   }
  // };

  const onChangeInput = async (e) => {
    const { value } = e.target;

    if (query.length === 0 && value === '/') {
      setQueryProps('');
    } else {
      setQueryProps(value);
    }
  };

  const handleKeyPress = async (e) => {
    if (query.length > 0) {
      if (e.key === 'Enter') {
        history.push(`/search/${replaceSlash(query)}`);
        setQueryProps(query);
      }
    }
  };

  const onClickChangeActiveAcc = async (key) => {
    if (
      accounts !== null &&
      Object.prototype.hasOwnProperty.call(accounts, key)
    ) {
      const defaultAccountTemp = { [key]: accounts[key] };
      const accountsPocket = {
        [key]: accounts[key],
        ...accounts,
      };
      setDefaultAccountProps(key, accounts[key]);
      setAccountsProps(accountsPocket);
      localStorage.setItem('pocket', JSON.stringify(defaultAccountTemp));
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'relative',
          padding: '0px 15px',
          zIndex: 3,
        }}
        className="container-distribution"
      >
        <div>
          <AppSideBar
            onCloseSidebar={() => setOpenMenu(false)}
            openMenu={openMenu}
          >
            <AppMenu addressActive={addressActive} />
          </AppSideBar>
          <SwichNetwork
            openMenu={openMenu}
            onClickOpenMenu={() => setOpenMenu((item) => !item)}
            countLink={countLink}
            bandwidth={bandwidth}
            amounPower={amounPower}
          />
        </div>

        <div
          style={{
            width: '52%',
            transform: 'translate(-50%, -80%)',
            // background: 'rgb(0 0 0 / 79%)',
            marginRight: '-50%',
            left: '50%',
            position: 'absolute',
            top: '50%',
            padding: '0px 20px',
            zIndex: '1',
          }}
        >
          <Input
            color="pink"
            onChange={(e) => onChangeInput(e)}
            onKeyPress={handleKeyPress}
            style={{ textAlign: 'center', fontSize: 24 }}
            // className="search-input"
            ref={textInput}
            value={encodeSlash(query)}
            autoComplete="off"
          />
        </div>
        <Electricity />
        <SwichAccount
          defaultAccount={defaultAccount}
          accounts={accounts}
          onClickChangeActiveAcc={onClickChangeActiveAcc}
        />
      </div>
      {/* {ipfsInitError !== null && location.pathname !== '/ipfs' && (
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
        </div> */}
      {/* )} */}

      {children}
      <Telegram />
      <GitHub />
    </div>
  );
}

const mapStateToProps = (store) => {
  return {
    bandwidth: store.bandwidth.bandwidth,
    query: store.query.query,
    mobile: store.settings.mobile,
    defaultAccount: store.pocket.defaultAccount,
    accounts: store.pocket.accounts,
  };
};

const mapDispatchprops = (dispatch) => {
  return {
    setBandwidthProps: (remained, maxValue) =>
      dispatch(setBandwidth(remained, maxValue)),
    setQueryProps: (query) => dispatch(setQuery(query)),
    setDefaultAccountProps: (name, account) =>
      dispatch(setDefaultAccount(name, account)),
    setAccountsProps: (accounts) => dispatch(setAccounts(accounts)),
    setTypeDeviceProps: (type) => dispatch(setTypeDevice(type)),
  };
};

export default connect(mapStateToProps, mapDispatchprops)(App);
