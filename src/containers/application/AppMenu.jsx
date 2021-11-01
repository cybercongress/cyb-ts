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
    subItems: [
      { name: 'Sixth Sense', to: '/sixthSense' },
      { name: 'Avatar', to: '/' },
    ],
  },
  {
    name: 'Genesis',
    to: '/genesis',
    subItems: [
      { name: 'BOOT', to: '/token/BOOT' },
      { name: 'TOCYB', to: '/token/TOCYB' },
      { name: 'CYB', to: '/token/CYB' },
    ],
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
    to: '/search/portal',
    subItems: [
      // { name: 'Manifesto', to: '/portal' },
      // { name: 'Leaderboard', to: '/portal/leaderboard' },
      // { name: 'Progress', to: '/portal/progress' },
      { name: 'Cyber vs Corp', to: '/portal/cyber-vs-corp' },
      { name: 'Cyber vs Gov', to: '/portal/cyber-vs-gov' },
    ],
  },
  {
    name: 'Dyson Sphere',
    to: '/search/dyson shpere',
    subItems: [
      { name: 'Active heroes', to: '/halloffame' },
      { name: 'Heroes at rest', to: '/halloffame/jailed' },
      { name: 'Become a Hero', to: '/search/become hero' },
      { name: 'BOOT', to: '/token/BOOT' },
      { name: 'Biosynthesis', to: '/search/biosynthesis reactor'},
      { name: 'H', to: '/token/H' },
    ],
  },
  {
    name: 'HFR',
    to: '/search/hfr',
    subItems: [
      { name: 'Investmint', to: '/mint' },
      { name: 'A', to: '/token/A' },
      { name: 'V', to: '/token/V' },
    ],
  },
  {
    name: 'Grid',
    to: '/search/grid',
    subItems: [
      { name: 'My energy', to: '/grid' },
      { name: 'Income', to: '/grid/income' },
      { name: 'Outcome', to: '/grid/outcome' },
    ],
  },
  {
    name: 'Teleport',
    to: '/teleport',
    active: false,
    subItems: [
      { name: 'Swap', to: '/teleport' },
      { name: 'Add liquidity', to: '/teleport/add-liquidity' },
      { name: 'Sub liquidity', to: '/teleport/sub-liquidity' },
      { name: 'Pools', to: '/teleport/pools' },
    ],
  },
  {
    name: 'Great Web',
    to: '/search/great web',
    subItems: [
      { name: 'Foundation', to: '/search/greatweb foundation' },
      { name: 'GOL', to: '/token/GOL' },
    ],
  },
  {
    name: 'Nebula',
    to: '/nebula',
    active: false,
    subItems: [
      { name: 'Rating', to: '/nebula' },
      { name: 'Create app', to: '/nebula/create app' },
    ],
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
