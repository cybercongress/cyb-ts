import React from 'react';
import SwitchNetwork from '../SwitchNetwork';
import Electricity from '../../home/electricity';
import SwitchAccount from '../SwitchAccount';
import Commander from './Commander/Commander';

type Props = {
  menuProps: {
    isOpen: boolean;
    toggleMenu: () => void;
  };
};

function Header({ menuProps }: Props) {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        padding: '0px 15px',
        zIndex: 5,
      }}
    >
      <SwitchNetwork
        openMenu={menuProps.isOpen}
        onClickOpenMenu={menuProps.toggleMenu}
      />

      <Commander />

      <Electricity />
      <SwitchAccount />
    </header>
  );
}

export default Header;
