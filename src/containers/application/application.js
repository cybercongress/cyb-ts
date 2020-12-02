import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Navigation,
  AppSideBar,
  NavigationLeft,
  Pane,
} from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import onClickOutside from 'react-onclickoutside';
import queryString from 'query-string';
import Menu from './ToggleMenu';
import AppMenu from './AppMenu';
import { MenuButton, BandwidthBar, Tooltip } from '../../components';
import Electricity from '../home/electricity';
import { getAccountBandwidth } from '../../utils/search/utils';
import { setBandwidth } from '../../redux/actions/bandwidth';
import { setDefaultAccount } from '../../redux/actions/pocket';
import { setQuery } from '../../redux/actions/query';
import { WP } from '../../utils/config';
import { formatNumber } from '../../utils/utils';

const cyber = require('../../image/cyber.png');
const cybFalse = require('../../image/cyb.svg');
const cybTrue = require('../../image/cybTrue.svg');
const bug = require('../../image/alert-circle-outline.svg');

const Item = ({ to, selected, nameApp, onClick }) => (
  <a
    className={`${selected ? 'active' : ''}`}
    onClick={onClick}
    href={`/${to}`}
  >
    <div className="battery-segment-text">{nameApp}</div>
  </a>
);

const htef = [
  { id: 1, to: '', nameApp: 'search' },
  { id: 2, to: 'gift', nameApp: 'gift' },
  { id: 3, to: 'takeoff', nameApp: 'takeoff' },
  { id: 4, to: 'tot', nameApp: 'tot' },
  { id: 5, to: 'auction', nameApp: 'auction' },
  { id: 6, to: 'brain', nameApp: 'brain' },
  { id: 7, to: 'governance', nameApp: 'governance' },
  { id: 8, to: 'wallet', nameApp: 'wallet' },
  // { id: 7, to: 'euler' }
];

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    let story = false;
    const localStorageStory = localStorage.getItem('story');
    if (localStorageStory !== null) {
      story = localStorageStory;
    }

    this.state = {
      openMenu: false,
      story,
      valueSearchInput: '',
      home: false,
      battery: false,
      address: null,
    };
    this.textInput = React.createRef();
    this.routeChange = this.routeChange.bind(this);
    // this.handleKeyFocus = this.handleKeyFocus.bind(this);
  }

  componentDidMount() {
    this.chekHomePage();
    this.chekEvangelism();
    this.checkAddressLocalStorage();
    document.onkeypress = (e) => {
      if (e.key === '/') {
        document.getElementById('search-input-searchBar').focus();
      }
    };
  }

  componentDidUpdate(prevProps) {
    const { location, query } = this.props;
    if (prevProps.location.pathname !== location.pathname) {
      this.chekHomePage();
      this.updateInput();
      this.chekEvangelism();
      if (location.pathname.indexOf(query) === -1) {
        this.clearInrut();
      }
      this.checkAddressLocalStorage();
      document.onkeypress = (e) => {
        if (e.key === '/') {
          document.getElementById('search-input-searchBar').focus();
        }
      };
    }
  }

  checkAddressLocalStorage = async () => {
    const {
      setBandwidthProps,
      setDefaultAccountProps,
      defaultAccount,
    } = this.props;
    const { account } = defaultAccount;
    if (account !== null && account.cyber) {
      this.getBandwidth(account.cyber.bech32);
    } else {
      console.warn('pocket');
      const localStoragePocket = localStorage.getItem('pocket');
      if (localStoragePocket !== null) {
        const dataLocalStoragePocket = JSON.parse(localStoragePocket);
        const accountPocket = Object.values(dataLocalStoragePocket)[0];
        const accountName = Object.keys(dataLocalStoragePocket)[0];
        setDefaultAccountProps(accountName, accountPocket);
        if (accountPocket.cyber) {
          this.getBandwidth(accountPocket.cyber.bech32);
        } else {
          setBandwidthProps(0, 0);
        }
      } else {
        setBandwidthProps(0, 0);
      }
    }
  };

  getBandwidth = async (address) => {
    const { setBandwidthProps } = this.props;
    if (address !== null) {
      const dataAccountBandwidth = await getAccountBandwidth(address);

      if (dataAccountBandwidth !== null) {
        const { remained, max_value: maxValue } = dataAccountBandwidth;
        setBandwidthProps(remained, maxValue);
      }
    }
  };

  updateInput = () => {
    const { query, setQueryProps } = this.props;

    setQueryProps(query);
  };

  clearInrut = () => {
    const { setQueryProps } = this.props;
    setQueryProps('');
  };

  chekEvangelism = () => {
    const { location } = this.props;
    const { search } = location;

    if (search.match(/thanks=/gm) && search.match(/thanks=/gm).length > 0) {
      const parsed = queryString.parse(search);
      console.log('parsed', parsed);
      localStorage.setItem('thanks', JSON.stringify(parsed.thanks));
    }
  };

  chekHomePage = () => {
    const { location } = this.props;
    if (location.pathname === '/') {
      // document.onkeypress = e => {
      //   document.getElementById('search-input-home').focus();
      // };
      this.setState({
        home: true,
      });
    } else {
      this.setState({
        home: false,
      });
    }
  };

  routeChange = (newPath) => {
    const { history } = this.props;
    const path = newPath;
    history.push(path);
  };

  onChangeInput = async (e) => {
    const { query, setQueryProps } = this.props;
    const { value } = e.target;

    if (query.length === 0 && value === '/') {
      setQueryProps('');
    } else {
      setQueryProps(value);
    }
  };

  handleKeyPress = async (e) => {
    const { query, setQueryProps } = this.props;

    if (query.length > 0) {
      if (e.key === 'Enter') {
        this.routeChange(`/search/${query}`);
        setQueryProps(query);
      }
    }
  };

  closeStory = () => {
    // console.log('dfd');
    this.setState({
      story: true,
    });
  };

  render() {
    const { openMenu, story, home, battery } = this.state;
    const {
      defaultAccount,
      query,
      ipfsStatus,
      bandwidth,
      block = 0,
    } = this.props;

    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            padding: 0,
          }}
          className="container-distribution"
        >
          <Pane position="relative">
            <MenuButton
              to="/brain"
              textTooltip={
                <span>
                  You are on the{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/cybercongress/cyberd/releases"
                  >
                    euler-6
                  </a>{' '}
                  network at block {formatNumber(block)}. euler-6 is
                  incentivized test network. Be careful. Details in{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://ipfs.io/ipfs/QmQ1Vong13MDNxixDyUdjniqqEj8sjuNEBYMyhQU4gQgq3"
                  >
                    whitepaper
                  </a>{' '}
                  and{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://cybercongress.ai/game-of-links/"
                  >
                    Game of links
                  </a>{' '}
                  rules.
                </span>
              }
              imgLogo={cyber}
            />
            <Pane bottom="-10px" right="-20%" position="absolute">
              <Tooltip
                placement="bottom"
                tooltip={
                  <span>
                    You are on the{' '}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://github.com/cybercongress/cyberd/releases"
                    >
                      euler-6
                    </a>{' '}
                    network at block{' '}
                    <span style={{ color: '#4ed6ae' }}>
                      {formatNumber(parseFloat(block))}
                    </span>
                    . euler-6 is incentivized test network. Be careful. Details
                    in{' '}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://ipfs.io/ipfs/QmQ1Vong13MDNxixDyUdjniqqEj8sjuNEBYMyhQU4gQgq3"
                    >
                      whitepaper
                    </a>{' '}
                    and{' '}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://cybercongress.ai/game-of-links/"
                    >
                      Game of links
                    </a>{' '}
                    rules.
                  </span>
                }
              >
                <img
                  alt="bugs"
                  style={{ width: '20px', height: '20px' }}
                  src={bug}
                />
              </Tooltip>
            </Pane>
            {/* <Pane
              className="battery-container"
              width="65px"
              position="absolute"
              right="60px"
            >
              <BandwidthBar
                height="15px"
                styleText={{ whiteSpace: 'nowrap' }}
                fontSize={12}
                colorText="#000"
                bwRemained={bandwidth.remained}
                bwMaxValue={bandwidth.maxValue}
              />
            </Pane> */}
          </Pane>
          <Pane
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
            />
          </Pane>
          {!home && (
            <Pane
              position="absolute"
              left="50%"
              transform="translate(-50%, 0)"
              marginRight="-50%"
              zIndex={1}
              backgroundColor="#000"
              borderRadius={20}
              width="60%"
              // className="box-shadow-input"
              height="100%"
            >
              <input
                onChange={(e) => this.onChangeInput(e)}
                onKeyPress={this.handleKeyPress}
                className="search-input"
                ref={this.textInput}
                value={query}
                autoComplete="off"
                id="search-input-searchBar"
                style={{
                  width: '100%',
                  height: 41,
                  fontSize: 20,
                  textAlign: 'center',
                  position: 'absolute',
                  top: '50%',
                  transform: 'translate(0, -50%)',
                  zIndex: 1,
                  backgroundColor: '#000',
                }}
              />
            </Pane>
          )}
          <Electricity />
          {defaultAccount.name !== null && (
            <Pane
              className="battery-container"
              width="65px"
              position="absolute"
              right="60px"
              whiteSpace="nowrap"
              fontSize="14px"
            >
              {defaultAccount.name}
            </Pane>
          )}
          <Pane position="relative">
            <MenuButton
              to="/pocket"
              imgLogo={ipfsStatus ? cybTrue : cybFalse}
              positionBugLeft
            />
            <Pane bottom="-10px" left="-20%" position="absolute">
              <Tooltip
                placement="bottom"
                tooltip={
                  <span>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://github.com/cybercongress/dot-cyber"
                    >
                      The dot-cyber
                    </a>{' '}
                    app has not been audited yet. Please, use it with caution.
                  </span>
                }
              >
                <img
                  alt="bugs"
                  style={{ width: '20px', height: '20px' }}
                  src={bug}
                />
              </Tooltip>
            </Pane>
          </Pane>
        </div>
        {/* </Navigation> */}
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    ipfsStatus: store.ipfs.statusIpfs,
    bandwidth: store.bandwidth.bandwidth,
    query: store.query.query,
    mobile: store.settings.mobile,
    block: store.block.block,
    defaultAccount: store.pocket.defaultAccount,
  };
};

const mapDispatchprops = (dispatch) => {
  return {
    setBandwidthProps: (remained, maxValue) =>
      dispatch(setBandwidth(remained, maxValue)),
    setQueryProps: (query) => dispatch(setQuery(query)),
    setDefaultAccountProps: (name, account) =>
      dispatch(setDefaultAccount(name, account)),
  };
};

export default connect(mapStateToProps, mapDispatchprops)(App);
