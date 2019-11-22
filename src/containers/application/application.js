import React, { Component } from 'react';
import {
  Navigation,
  AppSideBar,
  NavigationLeft,
  Pane,
} from '@cybercongress/gravity';
import onClickOutside from 'react-onclickoutside';
import { Timer, Tooltip } from '../../components/index';
import Menu from './ToggleMenu';
import AppMenu from './AppMenu';
import { Electricity } from '../home/electricity';

import Story from '../story/story';

const cyber = require('../../image/cyber.png');
const cyb = require('../../image/cyb.svg');

const wsUrl = 'wss://herzner1.cybernode.ai/websocket';

const Item = ({ to, selected, nameApp, onClick }) => (
  <a
    className={`${selected ? 'active' : ''}`}
    onClick={onClick}
    href={`#/${to}`}
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
      selectedIndex: 0,
      app: '',
      openMenu: false,
      story,
    };
  }

  // ws = new WebSocket(wsUrl);

  // componentDidMount() {
  //   this.getDataWS();
  // }

  // getDataWS = () => {
  //   this.ws.onopen = () => {
  //     console.log('connected');
  //     this.ws.send(
  //       JSON.stringify({
  //         method: 'subscribe',
  //         params: ["tm.event='NewBlockHeader'"],
  //         id: '1',
  //         jsonrpc: '2.0',
  //       })
  //     );
  //   };
  //   this.ws.onmessage = async evt => {
  //     const message = JSON.parse(evt.data);
  //     console.log('message', message);
  //   };

  //   this.ws.onclose = () => {
  //     console.log('disconnected');
  //   };
  // };

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

  onCustomClick = index => {
    console.log('index', index);
    this.setState({
      app: index.to,
    });
  };

  closeStory = () => {
    // console.log('dfd');
    this.setState({
      story: true,
    });
  };

  render() {
    const { app, openMenu, story } = this.state;
    // console.log('app', app);

    if (!story) {
      return <Story close={this.closeStory} />;
    }

    return (
      <div>
        <AppSideBar onCloseSidebar={this.toggleMenu} openMenu={openMenu}>
          <AppMenu menuItems={htef} />
        </AppSideBar>
        <div style={{ display: 'flex' }} className="container-distribution">
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
          <Menu imgLogo={cyber} toggleMenu={this.toggleMenu} />
          <Electricity />
          <a href="#/wallet">
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
          {/* {app === '' && (
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
          <Timer />
        </div>
        {/* </Navigation> */}
        {this.props.children}
      </div>
    );
  }
}

export default onClickOutside(App);
