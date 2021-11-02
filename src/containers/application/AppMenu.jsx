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
      { name: 'Brain', to: '/pgraph/' },
    ],
  },
  {
    name: 'Genesis',
    to: '/genesis',
    subItems: [],
  },
  {
    name: 'Portal',
    to: '/search/portal',
    subItems: [
      { name: 'Manifest', to: '/search/manifest' },
      // { name: 'Manifesto', to: '/portal' },
      // { name: 'Leaderboard', to: '/portal/leaderboard' },
      // { name: 'Progress', to: '/portal/progress' },
      { name: 'Get Knowledge Back', to: '/portal/cyber-vs-corp' },
      { name: 'Forget Governments', to: '/portal/cyber-vs-gov' },
    ],
  },
  {
    name: 'Bootloader',
    to: '/superintelligence',
    subItems: [
      { name: 'Transactions', to: '/network/bostrom/tx' },
      { name: 'Blocks', to: '/network/bostrom/block' },
      { name: 'Thoughts', to: '/search/dmn' },
      { name: 'Bostrom hub', to: '/search/bostrom' },
      { name: 'BOOT token', to: '/token/BOOT' },
    ],
  },
  {
    name: 'Superintelligence',
    to: '/search/superintelligence',
    subItems: [
      { name: 'Cyber the Knowledge', to: '/search/cyber' },
      { name: 'Protocol Framework', to: '/search/computing knowledge' },
      { name: 'Roadmap', to: '/search/cyber roadmap' },
      { name: 'TOCYB token', to: '/token/TOCYB' },
      { name: 'CYB token', to: '/token/CYB' },
    ],
  },  
  {
    name: 'Oracle',
    to: '/oracle',
    subItems: [
      { name: 'Cyberlinks', to: '/graph' },
      { name: 'Particles', to: '/particles' },
      { name: 'Neurons', to: '/search/neurons' },
      { name: 'Relevance Machine', to: '/search/rm' },
    ],
  },
  {
    name: 'Dyson Sphere',
    to: '/search/dyson shpere',
    subItems: [
      { name: 'Active heroes', to: '/halloffame' },
      { name: 'Heroes at rest', to: '/halloffame/jailed' },
      { name: 'Become a Hero', to: '/search/become hero' },
      { name: 'BOOT token', to: '/token/BOOT' },
      { name: 'Biosynthesis', to: '/search/biosynthesis reactor'},
      { name: 'H token', to: '/token/H' },
    ],
  },
  {
    name: 'HFR',
    to: '/search/hfr',
    subItems: [
      { name: 'Investmint', to: '/mint' },
      { name: 'Bandwidth', to: '/search/bandwidth' },
      { name: 'V token', to: '/token/V' },
      { name: 'Ranking', to: '/search/ranking' },
      { name: 'A token', to: '/token/A' },
      

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
      { name: 'Cyberlinks', to: '/search/cyberlink' },
      { name: 'Particles', to: '/search/particle' },
      { name: 'Neurons', to: '/search/neuron' },
      { name: 'Semcons', to: '/search/semantic convention' },
      { name: 'Cybernomics', to: '/search/cybernomics' },
      { name: 'Earthish', to: '/search/earthish' },
      { name: 'Kelvin Versioning', to: '/search/kelvin versioning' },
      { name: 'Foundation', to: '/search/greatweb foundation' },
      { name: 'GOL token', to: '/token/GOL' },
    ],
  },
  {
    name: 'Nebula',
    to: '/nebula',
    active: false,
    subItems: [
      { name: 'Rating', to: '/nebula' },
      { name: 'Create app', to: '/search/create app' },
      { name: 'Deploy contract', to: '/search/deploy contract' },
      { name: 'Give life', to: '/search/give life' },
    ],
  },
  {
    name: 'Senate',
    to: '/senate',
    subItems: [
      { name: 'Process', to: '/search/cyber governance' },
      { name: 'Evolution', to: '/search/cyber evolution' },
      { name: 'Self-reflection', to: '/search/cyber self-reflection' },
      { name: 'Investments', to: '/search/cyber investments' },
      { name: 'Adaptation', to: '/search/cyber adaptation' },
    ],
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
