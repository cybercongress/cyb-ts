import React, { useEffect, useState, useRef, useContext } from 'react';
import { connect } from 'react-redux';
import {
  Navigation,
  NavigationLeft,
  Pane,
} from '@cybercongress/gravity';
import { Link, useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
// import usePopperTooltip from 'react-popper-tooltip';
import Menu from './ToggleMenu';
import AppMenu from './AppMenu';
import { MenuButton, BandwidthBar, Tooltip } from '../../components';
import Electricity from '../home/electricity';
import { getIpfsHash } from '../../utils/search/utils';
import { setBandwidth } from '../../redux/actions/bandwidth';
import { initIpfs, setIpfsStatus, setIpfsID } from '../../redux/actions/ipfs';
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
import useIpfsStart from '../../ipfsHook';
import { GitHub, Telegram } from '../../components/actionBar';
import styles from './styles.scss';
import AppSideBar from './AppSideBar';
import SwichAccount from './swichAccount';
import Input from '../teleport/components/input';

const imgBostrom = require('../../image/cyb.svg');
const cybFalse = require('../../image/cyb.svg');
const cybTrue = require('../../image/cybTrue.svg');
const info = require('../../image/info-circle-outline.svg');
const lensIcon = require('../../image/lens-icon.svg');
const circleYellow = require('../../image/large-yellow-circle.png');

const ListAccounts = ({
  accounts,
  defaultAccount,
  children,
  onClickChangeActiveAcc,
}) => {
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
};

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
  setIpfsStatusProps,
  setTypeDeviceProps,
  setIpfsIDProps,
}) {
  const { jsCyber, updatetMarketData, updateDataTotalSupply } =
    useContext(AppContext);
  const { marketData, dataTotal } = useGetMarketData();
  const dataIpfsStart = useIpfsStart();
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
    initIpfsProps(dataIpfsStart.node);
    setIpfsStatusProps(dataIpfsStart.status);
    setTypeDeviceProps(dataIpfsStart.mobile);
    setIpfsIDProps(dataIpfsStart.id);
    // tryConnectToPeer(dataIpfsStart.node);
  }, [dataIpfsStart]);

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
            {/* <SwichNetwork>
              <MenuButton
                onClick={() => setOpenMenu(!openMenu)}
                imgLogo={selectNetworkImg(CYBER.CHAIN_ID)}
              />
            </SwichNetwork> */}
            {/* <Pane bottom="-10px" right="-20%" position="absolute">
              <LeftTooltip />
            </Pane> */}
          </div>
          {/* <Pane
            className="battery-container"
            width="65px"
            position="absolute"
            left="60px"
          >
            <BandwidthBar
              height="15px"
              styleText={{ whiteSpace: 'nowrap' }}
              fontSize={12}
              colorText="#000"
              bwRemained={bandwidth.remained}
              bwMaxValue={bandwidth.maxValue}
              countLink={countLink}
              amounPower={amounPower}
            />
          </Pane> */}
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
              // position="absolute"
              // left="50%"
              // transform="translate(-50%, 0)"
              // marginRight="-50%"
              // zIndex={1}
              // backgroundColor="#000"
              // borderRadius={20}
              // width="55%"
              // // className="box-shadow-input"
              // height="100%"
            >
              <Input
                onChange={(e) => onChangeInput(e)}
                onKeyPress={handleKeyPress}
                style={{ textAlign: 'center', fontSize: 24 }}
                // className="search-input"
                ref={textInput}
                value={encodeSlash(query)}
                autoComplete="off"
                // id="search-input-searchBar"
                // style={{
                //   width: '100%',
                //   height: 41,
                //   fontSize: 20,
                //   textAlign: 'center',
                //   position: 'absolute',
                //   top: '50%',
                //   transform: 'translate(0, -50%)',
                //   zIndex: 1,
                //   paddingLeft: '35px',
                //   backgroundColor: '#000',
                // }}
              />
              {/* <img
                src={lensIcon}
                alt="lensIcon"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '14px',
                  transform: 'translate(0, -50%)',
                  width: '15px',
                  zIndex: 1,
                }}
              /> */}
              {/* {keywordHash !== null && (
                <Link to={`/ipfs/${keywordHash}`}>
                  <div>
                    <img
                      src={info}
                      alt="lensIcon"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '35px',
                        transform: 'translate(0, -50%)',
                        width: '15px',
                        zIndex: 1,
                        cursor: 'pointer',
                      }}
                    />
                  </div>
                </Link>
              )} */}
            </div>
          )}
          <Electricity />
          <SwichAccount
            defaultAccount={defaultAccount}
            accounts={accounts}
            onClickChangeActiveAcc={onClickChangeActiveAcc}
          />
          {/* {defaultAccount.name !== null && (
            <Pane
              className="battery-container"
              width="fit-content"
              position="absolute"
              right="60px"
              whiteSpace="nowrap"
              fontSize="14px"
              backgroundColor="#000"
              boxShadow="0 0 5px 5px #000"
            >
              <ListAccounts
                accounts={accounts}
                onClickChangeActiveAcc={onClickChangeActiveAcc}
                defaultAccount={defaultAccount}
              >
                {defaultAccount.name}
              </ListAccounts>
            </Pane>
          )}
          <Pane position="relative">
            <MenuButton
              to="/robot"
              imgLogo={ipfsStatus ? cybTrue : cybFalse}
              positionBugLeft
            />
           
          </Pane> */}
        </div>
      )}

      {/* </Navigation> */}
      {children}
      <Telegram />
      <GitHub />
    </div>
  );
}

const mapStateToProps = (store) => {
  return {
    ipfsStatus: store.ipfs.statusIpfs,
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
  };
};

export default connect(mapStateToProps, mapDispatchprops)(App);
