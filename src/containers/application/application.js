import React, { Component } from 'react';
import {
  Navigation,
  AppSideBar,
  NavigationLeft,
  Pane
} from '@cybercongress/gravity';
import { Timer, Tooltip } from '../../components/index';
import Menu from './ToggleMenu';
import AppMenu from './AppMenu';
import { Electricity } from '../home/electricity';

const cyber = require('../../image/cyber.png');
const cyb = require('../../image/cyb.svg');

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
  { id: 7, to: 'governance', nameApp: 'governance' }
  // { id: 7, to: 'cyber' },
  // { id: 7, to: 'euler' }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      app: '',
      openMenu: false
    };
  }

  componentDidMount() {
    const dura = localStorage.getItem('LAST_DURA');
    this.setState({
      app: dura
    });
  }

  toggleMenu = () => {
    const { openMenu } = this.state;
    this.setState({
      openMenu: !openMenu
    });
  };

  onCustomClick = index => {
    console.log('index', index);
    this.setState({
      app: index.to
    });
  };

  render() {
    const { app, openMenu } = this.state;
    console.log('app', app);
    return (
      <main>
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
          <a href="https://cyb.ai/" target="_blank">
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
      </main>
    );
  }
}

export default App;
