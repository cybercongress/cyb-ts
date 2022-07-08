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
    { name: 'My robot', to: '/', subItems: [] },
    {
      name: 'Contracts',
      to: '/contracts',
      subItems: [],
    },
    {
      name: 'Portal',
      to: '/portal',
      subItems: [
        { name: 'Citizenship', to: '/citizenship' },
        { name: 'Gift', to: '/gift' },
        // { name: 'Release', to: '/release' },
      ],
    },
    {
      name: 'Teleport',
      to: '/teleport',
      subItems: [{ name: 'Pools', to: '/teleport/pools' }],
    },
    {
      name: 'Dyson Sphere',
      to: '/halloffame',
      subItems: [{ name: 'Heroes at rest', to: '/halloffame/jailed' }],
    },
    { name: 'HFR', to: '/mint', subItems: [] },
    { name: 'My Avatar', to: linkAvatar, subItems: [] },
    { name: 'My Community', to: linkCommunity, subItems: [] },
    { name: 'My Sense', to: '/sixthSense', subItems: [] },
    { name: 'My Brain', to: linkBrain, subItems: [] },
    { name: 'My Energy', to: '/grid', subItems: [] },
    // { name: 'Lifeforms', to: '/contracts', subItems: [] },
    { name: 'Oracle', to: '/bootloader', subItems: [] },

    { name: 'Nebula', to: '/nebula', subItems: [] },
    { name: 'Senate', to: '/senate', subItems: [] },
    { name: 'Help', to: '/help', subItems: [] },
  ];
};

const AppMenu = ({ addressActive }) => {
  return (
    <MenuContainer>
      <Bookmarks items={itemsMenu(addressActive)} />
      <ReportLinkContainer>{}</ReportLinkContainer>
    </MenuContainer>
  );
};

export default AppMenu;
