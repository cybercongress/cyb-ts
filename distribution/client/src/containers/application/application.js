import React, { Component } from 'react';
import { Timer, Tooltip } from '../../components/index';
const bug = require('../../image/tiks.svg');

const Item = ({ to, selected }) => (
  <a className={`${selected ? 'active' : ''}`} href={`#/${to}`}>
    <div className="battery-segment-text">{to}</div>
  </a>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0
    };
  }

  onCustomClick = index => {
    this.setState({
      selectedIndex: index
    });
  };

  render() {
    const htef = [
      { id: 1, to: 'got' },
      { id: 2, to: 'takeoff' },
      { id: 3, to: 'auction' },
      // { id: 4, to: 'gift' },
      // { id: 5, to: 'final' },
      // { id: 6, to: 'cyber' },
      // { id: 7, to: 'euler' }
    ];

    return (
      <main>
        <div className="container-distribution">
        <Tooltip tooltip='The app is not production ready and is for testing and experimentation only. All send tokens will be lost.' placement='bottom'>
          <img src={bug} style={{
            width: 50,
            height: 50
          }} />
          </Tooltip>
          <div className="battery">
            {htef.map(item => (
              <Item
              key={item.to}
              selected={item.id === this.state.selectedIndex}
              to={item.to}
              // onClick={e => this.onCustomClick(item.id)}
              />
              ))}
          </div>
              <Timer />
        </div>
        {this.props.children}
      </main>
    );
  }
}

export default App;
