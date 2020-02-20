import React, { Component } from 'react';
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
import { MenuButton } from '../../components';
import Electricity from '../home/electricity';

const cyber = require('../../image/cyber.png');
const cyb = require('../../image/cyb.svg');

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
    };
    this.routeChange = this.routeChange.bind(this);
  }

  componentDidMount() {
    this.chekHomePage();
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
      // document.onkeypress = e => {
      //   document.getElementById('search-input-searchBar').focus();
      // };
    }
  }

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
    const { openMenu, story, home, valueSearchInput } = this.state;
    const { children, location } = this.props;

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
          {/* <Tooltip
              tooltip="The app is not production ready and is for testing and experimentation only. All send tokens will be lost."
              placement="bottom"
            >
              <img
                src={bug}
                alt="bug"
                style={{
                  width: 50,
                  height: 50
                }}
              />
            </Tooltip> */}
          <MenuButton
            to="/brain"
            textTooltip={
              <span>
                You are on the euler-5 network. Euler-5 is incentivized test
                network. Be careful. Details in{' '}
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
              className="box-shadow-input"
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

          <MenuButton
            to="/pocket"
            imgLogo={cyb}
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
          {/*
          <a href="/pocket">
            <Pane
              width={50}
              // height={50}
              position="relative"
              display="flex"
              align-items="flex-end"
            >
              <img style={{ width: 'inherit' }} alt="cyb" src={cyb} />
            </Pane>
          </a>
          */
          /* {app === '' && (
            <div className="battery">
              {htef.map(item => (
                <Item
                  key={item.to}
                  selected={item.id === this.state.selectedIndex}
                  to={item.to}
                  nameApp={item.nameApp}
                  onClick={e => this.onCustomClick(item)}
                />
              ))}
            </div>
          )} */}
          {/* <Timer /> */}
        </div>
        {/* </Navigation> */}
        {this.props.children}
      </div>
    );
  }
}

export default App;
