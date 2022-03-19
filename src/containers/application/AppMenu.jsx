import React, { Component } from 'react';

import {
  MenuContainer,
  AddMenuItem,
  AddMenuItemReject,
  ReportLinkContainer,
  AddMenuItemContainer,
} from '@cybercongress/gravity';

import { Bookmarks } from '../../components/appMenu/AppMenu';

const itemsMenu = (address) => {
  let linkAvatar = '/';
  let linkBrain = '/graph';
  let linkCommunity = '/';
  if (address !== null) {
    linkAvatar = `/network/bostrom/contract/${address.bech32}`;
    linkCommunity = `/network/bostrom/contract/${address.bech32}/community`;
    linkBrain = `/pgraph/${address.bech32}`;
  }
  return [
    { name: 'My robot', to: '/', subItems: []},
    { name: 'Portal', to: '/search/portal', subItems: [] },
    { name: 'Teleport', to: '/teleport', subItems: [] },
    { name: 'Dyson Sphere', to: 'halloffame', subItems: [] },
    { name: 'HFR', to: '/mint', subItems: [] },
    { name: 'My Avatar', to: linkAvatar, subItems: [] },
    { name: 'My Community', to: linkCommunity, subItems: [] },
    { name: 'My Sense', to: '/sixthSense', subItems: [] },
    { name: 'My Brain', to: linkBrain, subItems: [] },
    { name: 'My Energy', to: '/grid', subItems: [] },
    { name: 'Lifeforms',to: '/contracts', subItems: [] },
    { name: 'Oracle', to: '/bootloader', subItems: [] },

    { name: 'Nebula', to: '/nebula', subItems: [] },
    { name: 'Senate', to: '/senate', subItems: [] }
  ];
};

const AppMenu = ({ addressActive }) => {
  return (
    <MenuContainer>
      <Bookmarks items={itemsMenu(addressActive)} />
      <ReportLinkContainer>
        {}
      </ReportLinkContainer>
    </MenuContainer>
  );
};

export default AppMenu;
