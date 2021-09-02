import React, { Component } from 'react';

import {
  MenuContainer,
  // Bookmarks,
  // LogoLink,
  AddMenuItem,
  AddMenuItemReject,
  ReportLinkContainer,
  AddMenuItemContainer,
} from '@cybercongress/gravity';

import { Bookmarks } from '../../components/appMenu/AppMenu';

const items = [
  {
    name: 'My robot',
    to: '/',
    subItems: {},
  },
  {
    name: 'Superintelligence',
    to: '/superintelligence',
    subItems: {},
  },
  {
    name: 'Oracle',
    to: '/oracle',
    subItems: [
      { name: 'Cyberlinks', to: '/graph' },
      { name: 'Particles', to: '/particles' },
      // { name: 'Richlist', to: '/search/richlist' },
      { name: 'Transactions', to: '/network/bostrom/tx' },
      { name: 'Blocks', to: '/network/bostrom/block' },
    ],
  },
  {
    name: 'Portal',
    to: '/portal',
    active: false,
    subItems: [
      { name: 'Manifesto', to: '/portal' },
      { name: 'Leaderboard', to: '/portal/leaderboard' },
      { name: 'Progress', to: '/portal/progress' },
      { name: 'Cyber vs Corp', to: '/portal/cyber-vs-corp' },
      { name: 'Cyber vs Gov', to: '/portal/cyber-vs-gov' },
    ],
  },
  {
    name: 'Hall of Fame',
    to: '/halloffame',
    active: false,
    subItems: [
      { name: 'Active heroes', to: '/halloffame' },
      { name: 'Heroes at rest', to: '/halloffame/jailed' },
      { name: 'Become a Hero', to: '/search/Become a Hero' },
    ],
  },
  {
    name: 'Dyson Sphere',
    to: '/search/Dyson Sphere',
    subItems: [
      { name: 'Minting', to: '/mint' },
      { name: 'Routing', to: '/energy' },
    ],
  },
  {
    name: 'Market',
    to: '/market',
    active: false,
    subItems: [
      { name: 'BOOT', to: '/market' },
      { name: 'H', to: '/market/H' },
      { name: 'A', to: '/market/A' },
      { name: 'V', to: '/market/V' },
      { name: 'GOL', to: '/market/GOL' },
      { name: 'CYB', to: '/market/CYB' },
    ],
  },
  {
    name: 'Nebula',
    to: '/nebula',
    active: false,
    subItems: [
      { name: 'Rating', to: '/nebula' },
      { name: 'Create app', to: '/nebula/Create app' },
    ],
  },
  {
    name: 'Sixth Sense',
    to: '/sixthSense',
    subItems: [],
  },
  {
    name: 'Senate',
    to: '/senate',
    subItems: [],
  },
  {
    name: 'Help',
    to: '/search/help',
    subItems: [],
  },
];

const AppMenu = ({ menuItems }) => {
  return (
    <MenuContainer>
      <Bookmarks items={items} />
      <ReportLinkContainer>
        {/* <a
                      target='__blank'
                      href='https://github.com/cybercongress/cyb'
                    >
                    Find a bug?
                    </a> */}
      </ReportLinkContainer>
    </MenuContainer>
  );
};

export default AppMenu;
