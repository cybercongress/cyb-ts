import React from 'react';
// import CybLink from '../CybLink';
import './AppMenu.css';
import { Pane } from '@cybercongress/gravity';

const Logo = props => (
  <a {...props} className="logo">
    logo
  </a>
);

export const LogoLink = ({ onClick }) => (
  <div className="menu-logo">
    <Logo dura="" onClick={onClick} />
  </div>
);

const Items = ({ item, deleteAppFromMenu, selected, ...props }) => (
  <a {...props} style={{ color: '#fff' }} href={`#/${item.to}`}>
    <Pane
      display="flex"
      paddingY={10}
      alignItems="center"
      className={` bookmarks__item ${selected ? 'active' : ''}`}
      key={item.nameApp}
    >
      <Pane
        display="flex"
        width="100%"
        height={30}
        paddingLeft={20}
        paddingRight={10}
        justifyContent="space-between"
        alignItems="center"
      >
        <Pane alignItems="center" flexGrow={1} display="flex">
          {item.nameApp}
        </Pane>
      </Pane>
    </Pane>
  </a>
);

export class Bookmarks extends React.Component {
  state = {
    selectedIndex: 0
  };

  onCustomClick = index => {
    this.setState({
      selectedIndex: index
    });
  };

  render() {
    const { items, deleteMenuItem, ...props } = this.props;

    return (
      <div className="bookmarks">
        {items.map((item, index) => (
          <Items
            selected={index === this.state.selectedIndex}
            onClick={e => this.onCustomClick(index)}
            {...props}
            key={item.nameApp}
            item={item}
          />
        ))}
      </div>
    );
  }
}
