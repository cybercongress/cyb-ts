import React, { Component } from 'react';
import { Timer, Tooltip } from '../../components/index';
const bug = require('../../image/tiks.svg');

const Item = ({ to, selected, nameApp }) => (
  <a className={`${selected ? 'active' : ''}`} href={`#/${to}`}>
    <div className="battery-segment-text">{nameApp}</div>
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
    console.log('index', index);
    this.setState({
      selectedIndex: index
    });
  };

  render() {
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
    // console.log('selectedIndex', this.state.selectedIndex);
    return (
      <main>
        <div className="container-distribution">
          <Tooltip
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
          </Tooltip>
          <div className="battery">
            {htef.map(item => (
              <Item
                key={item.to}
                selected={item.id === this.state.selectedIndex}
                to={item.to}
                nameApp={item.nameApp}
                // onClick={(e) => this.onCustomClick(item.id)}
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
