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
import Menu from './ToggleMenu';
import AppMenu from './AppMenu';
import { MenuButton, BandwidthBar } from '../../components';
import Electricity from '../home/electricity';
import { getAccountBandwidth } from '../../utils/search/utils';
import { setBandwidth } from '../../redux/actions/bandwidth';

const cyber = require('../../image/cyber.png');
const cybFalse = require('../../image/cyb.svg');
const cybTrue = require('../../image/cybTrue.svg');

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

class App extends Component {
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
    this.routeChange = this.routeChange.bind(this);
  }

  componentDidMount() {
    this.chekHomePage();
    this.checkAddressLocalStorage();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    const { valueSearchInput } = this.state;
    if (prevProps.location.pathname !== location.pathname) {
      this.chekHomePage();
      this.checkStory();
      this.updateInput();
      if (location.pathname.indexOf(valueSearchInput) === -1) {
        this.clearInrut();
      }
      this.checkAddressLocalStorage();
      // document.onkeypress = e => {
      //   document.getElementById('search-input-searchBar').focus();
      // };
    }
  }

  checkAddressLocalStorage = async () => {
    const { setBandwidthProps } = this.props;
    let address = [];

    const localStorageStory = localStorage.getItem('pocket');
    if (localStorageStory !== null) {
      address = JSON.parse(localStorageStory);
      if (address.cyber.bech32) {
        this.getBandwidth(address.cyber.bech32);
      }
    } else {
      setBandwidthProps(0, 0);
    }
  };

  getBandwidth = async address => {
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
    const { query } = this.props;

    this.setState({ valueSearchInput: query });
  };

  clearInrut = () => {
    const { funcUpdate } = this.props;

    const valueSearchInput = '';
    this.setState({ valueSearchInput });
    funcUpdate(valueSearchInput);
  };

  checkStory = () => {
    let story = false;
    const localStorageStory = localStorage.getItem('story');
    if (localStorageStory !== null) {
      story = localStorageStory;
    }
    this.setState({ story });
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

  routeChange = newPath => {
    const { history } = this.props;
    const path = newPath;
    history.push(path);
  };

  onChangeInput = async e => {
    const { value } = e.target;

    await this.setState({
      valueSearchInput: value,
    });
  };

  handleKeyPress = async e => {
    const { valueSearchInput } = this.state;
    const { funcUpdate } = this.props;

    if (valueSearchInput.length > 0) {
      if (e.key === 'Enter') {
        this.routeChange(`/search/${valueSearchInput}`);
        funcUpdate(valueSearchInput);
      }
    }
  };

  handleClickOutside = evt => {
    this.setState({
      openMenu: false,
    });
  };

  toggleMenu = () => {
    const { openMenu } = this.state;
    this.setState({
      openMenu: !openMenu,
    });
  };

  closeStory = () => {
    // console.log('dfd');
    this.setState({
      story: true,
    });
  };

  render() {
    const { openMenu, story, home, valueSearchInput, battery } = this.state;
    const { children, location, ipfsStatus, bandwidth } = this.props;

    if (!story && home) {
      this.routeChange('/episode-1');
    }

    if (!story && location.pathname === '/episode-1') {
      return <div>{children}</div>;
    }

    return (
      <div>
        <AppSideBar onCloseSidebar={this.toggleMenu} openMenu={openMenu}>
          <AppMenu menuItems={htef} />
        </AppSideBar>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
          }}
          className="container-distribution"
        >
          <MenuButton
            to="/brain"
            textTooltip={
              <span>
                You are on the{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/cybercongress/cyberd/releases/tag/euler"
                >
                  euler
                </a>{' '}
                network. euler is incentivized test network. Be careful.
                Details in{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://ipfs.io/ipfs/QmceNpj6HfS81PcCaQXrFMQf7LR5FTLkdG9sbSRNy3UXoZ"
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
                onChange={e => this.onChangeInput(e)}
                onKeyPress={this.handleKeyPress}
                className="search-input"
                value={valueSearchInput}
                autoComplete="off"
                id="search-input-searchBar"
                style={{
                  width: '100%',
                  height: 41,
                  fontSize: 20,
                  boxShadow: `0 0 5px 0 #00ffa387`,
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
          <Pane className="battery-container" width="60px" marginRight="10px">
            <BandwidthBar
              height="10px"
              styleText={{ whiteSpace: 'nowrap' }}
              fontSize={9}
              colorText="#000"
              bwRemained={bandwidth.remained}
              bwMaxValue={bandwidth.maxValue}
            />
          </Pane>
          <MenuButton
            to="/pocket"
            imgLogo={ipfsStatus ? cybTrue : cybFalse}
            positionBugLeft
            textTooltip={
              <span>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/cybercongress/dot-cyber"
                >
                  dot-cyber
                </a>{' '}
                app has not been audited yet. Please, use it with caution.
              </span>
            }
          />
        </div>
        {/* </Navigation> */}
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    ipfsStatus: store.ipfs.statusIpfs,
    bandwidth: store.bandwidth.bandwidth,
  };
};

const mapDispatchprops = dispatch => {
  return {
    setBandwidthProps: (remained, maxValue) =>
      dispatch(setBandwidth(remained, maxValue)),
  };
};

export default connect(mapStateToProps, mapDispatchprops)(App);
