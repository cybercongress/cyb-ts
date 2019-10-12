import React, { Component } from 'react';
import { Timer } from '../../components/index';

const Item = ({ to, selected }) => (
  <a className={`${selected ? 'active' : ''}`} href={`#/${to}`} />
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
      { id: 2, to: 'funding' },
      { id: 3, to: 'auction' },
      { id: 4, to: 'gift' },
      { id: 5, to: 'final' },
      { id: 6, to: 'cyber' },
      { id: 7, to: 'euler' }
    ];

    return (
      <main>
        <div className="container-distribution">
          <Timer />
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
        </div>

        {this.props.children}
      </main>
    );
  }
}

export default App;
