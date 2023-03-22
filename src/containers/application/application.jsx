import React, { useEffect, useState, useRef, useContext } from 'react';
import { connect } from 'react-redux';
import { Navigation, NavigationLeft, Pane } from '@cybercongress/gravity';
import { Link, useHistory, useLocation } from 'react-router-dom';
// import usePopperTooltip from 'react-popper-tooltip';
import Menu from './ToggleMenu';
import AppMenu from './AppMenu';
import { MenuButton, BandwidthBar, Tooltip, Input } from '../../components';
import Electricity from '../home/electricity';
import { getIpfsHash } from '../../utils/search/utils';
import { setBandwidth } from '../../redux/actions/bandwidth';
import {
  initIpfs,
  setIpfsStatus,
  setIpfsID,
  setIpfsFailed,
  setIpfsReady,
  setIpfsPending,
} from '../../redux/actions/ipfs';
import { setTypeDevice } from '../../redux/actions/settings';
import { setDefaultAccount, setAccounts } from '../../redux/actions/pocket';
import { setQuery } from '../../redux/actions/query';
import { CYBER, WP } from '../../utils/config';
import {
  formatNumber,
  convertResources,
  coinDecimals,
  reduceBalances,
  replaceSlash,
  encodeSlash,
  selectNetworkImg,
} from '../../utils/utils';
import { AppContext } from '../../context';
import LeftTooltip from './leftTooltip';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import SwichNetwork from './swichNetwork';
import useGetMarketData from '../nebula/useGetMarketData';
import useNewIpfs from '../../useNewIpfs';
import { GitHub, Telegram } from '../../components/actionBar';
import styles from './styles.scss';
import AppSideBar from './AppSideBar';
import SwichAccount from './swichAccount';
import useIsMobileTablet from '../../hooks/useIsMobileTablet';
import { InfoCard } from '../portal/components';

const imgBostrom = require('../../image/cyb.svg');
const cybFalse = require('../../image/cyb.svg');
const cybTrue = require('../../image/cybTrue.svg');
const info = require('../../image/info-circle-outline.svg');
const lensIcon = require('../../image/lens-icon.svg');
const circleYellow = require('../../image/large-yellow-circle.png');

function ListAccounts({
  accounts,
  defaultAccount,
  children,
  onClickChangeActiveAcc,
}) {
  let items = {};
  if (accounts && accounts !== null) {
    items = Object.keys(accounts).map((key, i) => {
      let active = false;
      if (
        defaultAccount &&
        defaultAccount.name &&
        defaultAccount.name === key
      ) {
        active = true;
      }
      return (
        <Pane
          key={`${key}_${i}`}
          paddingX={10}
          paddingY={5}
          whiteSpace="nowrap"
          color={active ? '#ff9100' : '#fff'}
          onClick={() =>
            active ? '' : onClickChangeActiveAcc(key, accounts[key])
          }
          className={active ? '' : 'account-popaps'}
        >
          {key}
        </Pane>
      );
    });
  }
  return (
    <Tooltip
      placement="bottom"
      trigger={['click', 'hover']}
      tooltip={
        Object.keys(items).length > 0
          ? items
          : "you don't have accounts in your pocket"
      }
    >
      <Pane>{children}</Pane>
    </Tooltip>
  );
}

function App({
  defaultAccount,
  query,
  ipfsStatus,
  bandwidth,
  accounts,
  setQueryProps,
  setAccountsProps,
  setDefaultAccountProps,
  setBandwidthProps,
  time,
  children,
  initIpfsProps,
  setTypeDeviceProps,
  setIpfsIDProps,
  setIpfsFailedProps,
  setIpfsReadyProps,
  setIpfsPendingProps,
}) {
  const { jsCyber, updatetMarketData, updateDataTotalSupply } =
    useContext(AppContext);
  const { marketData, dataTotal } = useGetMarketData();
  const { isMobile } = useIsMobileTablet();
  // const dataIpfsStart = useIpfsStart();
  const { ipfs, isIpfsReady, ipfsInitError, isIpfsPending } = useNewIpfs();

  const { addressActive } = useSetActiveAddress(defaultAccount);
  const textInput = useRef();
  const history = useHistory();
  const location = useLocation();
  const [home, setHome] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [countLink, setCountLink] = useState(0);
  const [priceLink, setPriceLink] = useState(0.25);
  const [amounPower, setAmounPower] = useState(0);
  const [keywordHash, setKeywordHash] = useState(null);
  const [story, setStory] = useState(true);

  // console.log(accounts);

  useEffect(() => {
    const updateIpfsStage = async () => {
      setIpfsPendingProps(isIpfsPending);
      setIpfsFailedProps(ipfsInitError);
      setIpfsReadyProps(isIpfsReady);

      if (ipfs !== null) {
        initIpfsProps(ipfs);
      }
    };
    updateIpfsStage();
  }, [ipfs, ipfsInitError, isIpfsReady, isIpfsPending]);

  useEffect(() => {
    setTypeDeviceProps(isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (Object.keys(marketData).length > 0) {
      updatetMarketData(marketData);
    }
  }, [marketData]);

  useEffect(() => {
    if (Object.keys(dataTotal).length > 0) {
      updateDataTotalSupply(dataTotal);
    }
  }, [dataTotal]);

  useEffect(() => {
    const { pathname } = location;
    if (pathname.indexOf(query) === -1) {
      setQueryProps('');
    }
  }, [location.pathname]);

  useEffect(() => {
    const { pathname } = location;
    if (pathname.match(/search/gm) && pathname.match(/search/gm).length > 0) {
      const querySubstr = pathname.substr(8, pathname.length);
      getKeywordHash(querySubstr);
    } else {
      setKeywordHash(null);
    }
  }, [location]);

  const getKeywordHash = async (text) => {
    const hash = await getIpfsHash(encodeSlash(text).toLowerCase());
    setKeywordHash(hash);
  };

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

  // if (story) {
  //   return <div>{children}</div>;
  // }

  return (
    <div>
      {story && (
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

          {!home && (
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
          )}
          <Electricity />
          <SwichAccount
            defaultAccount={defaultAccount}
            accounts={accounts}
            onClickChangeActiveAcc={onClickChangeActiveAcc}
          />
        </div>
      )}
      {ipfsInitError !== null && location.pathname !== '/ipfs' && (
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

      {children}
      <Telegram />
      <GitHub />
    </div>
  );
}

const mapStateToProps = (store) => {
  return {
    ipfsStatus: store.ipfs.ready,
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
    initIpfsProps: (ipfsNode) => dispatch(initIpfs(ipfsNode)),
    setIpfsStatusProps: (status) => dispatch(setIpfsStatus(status)),
    setTypeDeviceProps: (type) => dispatch(setTypeDevice(type)),
    setIpfsIDProps: (id) => dispatch(setIpfsID(id)),
    setIpfsFailedProps: (status) => dispatch(setIpfsFailed(status)),
    setIpfsReadyProps: (status) => dispatch(setIpfsReady(status)),
    setIpfsPendingProps: (status) => dispatch(setIpfsPending(status)),
  };
};

export default connect(mapStateToProps, mapDispatchprops)(App);
