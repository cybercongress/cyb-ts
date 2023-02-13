import React, { Component } from 'react';

import { MenuContainer, ReportLinkContainer } from '@cybercongress/gravity';

import { Bookmarks } from '../../components/appMenu/AppMenu';
import { CYBER } from '../../utils/config';

import nebulaIcon from '../../image/temple/nebula.png';
import teleport from '../../image/temple/teleport.jpg';
import hfr from '../../image/temple/hfr.png';
import temple from '../../image/temple/temple.png';
import robot from '../../image/temple/robot.jpg';
import shpere from '../../image/temple/shpere.png';
import senate from '../../image/temple/senate.png';
import portal from '../../image/temple/portal.svg';
import oracle from '../../image/temple/oracle.png';
import warp from '../../image/temple/warp.png';
import hub from '../../image/temple/hub.png';
import zhdun from '../../image/temple/zhdun.png';

const itemsMenu = (address) => {
  let linkLog = '/robot';
  let linkBrain = '/graph';
  let linkSwarm = '/robot';
  let linkSigma = '/robot';
  let linkSecurity = '/robot';
  let linkCyberlinks = '/robot';
  let linkTimeline = '/robot';
  let linkBadges = '/robot';
  if (address !== null) {
    linkLog = `/network/bostrom/contract/${address.bech32}`;
    linkSwarm = `/network/bostrom/contract/${address.bech32}/swarm`;
    linkSigma = `/network/bostrom/contract/${address.bech32}/sigma`;
    linkSecurity = `/network/bostrom/contract/${address.bech32}/security`;
    linkCyberlinks = `/network/bostrom/contract/${address.bech32}/cyberlinks`;
    linkTimeline = `/network/bostrom/contract/${address.bech32}/timeline`;
    linkBadges = `/network/bostrom/contract/${address.bech32}/badges`;
    linkBrain = `/pgraph/${address.bech32}`;
  }

  let myRobotLinks = [];

  if (address !== null) {
    myRobotLinks = [
      { name: 'Sigma', to: '/sigma' },
      { name: 'Log', to: linkLog },
      { name: 'Swarm', to: linkSwarm },
      { name: 'Security', to: linkSecurity },
      // { name: 'Cyberlinks', to: linkCyberlinks },
      { name: 'Timeline', to: linkTimeline },
      { name: 'Sense', to: '/sixthSense' },
      { name: 'Brain', to: linkBrain },
      { name: 'Energy', to: '/grid' },
      { name: 'Badges', to: linkBadges },
    ];
  }

  const listItemMenu = [
    { name: 'Temple', to: '/', subItems: [], icon: temple },
    { name: 'Nebula', to: '/nebula', subItems: [], icon: nebulaIcon },
    {
      name: 'My robot',
      icon: robot,
      to: '/robot',
      subItems: myRobotLinks,
    },
    {
      name: 'Teleport',
      to: '/teleport',
      icon: teleport,
      subItems: [],
    },
    {
      name: 'Warp',
      icon: warp,
      to: '/warp',
      subItems: [
        { name: 'Add liquidity', to: '/warp/add-liquidity' },
        { name: 'Create pool', to: '/warp/create-pool' },
        { name: 'Sub liquidity', to: '/warp/sub-liquidity' },
      ],
    },
    {
      name: 'Sphere',
      icon: shpere,
      to: '/sphere',
      subItems: [{ name: 'Heroes at rest', to: '/sphere/jailed' }],
    },
    { name: 'HFR', icon: hfr, to: '/hfr', subItems: [] },
    // { name: 'Lifeforms', to: '/contracts', subItems: [] },
    {
      name: 'Oracle',
      to: '/oracle',
      icon: oracle,
      subItems: [
        { name: 'Particles', to: '/particles' },
        { name: 'Blocks', to: '/network/bostrom/blocks' },
        { name: 'Txs', to: '/network/bostrom/tx' },
        { name: 'Contracts', to: '/contracts' },
        { name: 'Libs', to: '/libs' },
      ],
    },
    {
      name: 'Hub',
      to: '/search/hub',
      icon: hub,
      subItems: [
        { name: 'Networks', to: '/networks' },
        { name: 'Add network', to: '/networks/add' },
      ],
    },
    { name: 'Senate', icon: senate, to: '/senate', subItems: [] },
    // {
    //   name: 'Help',
    //   icon: zhdun,
    //   to: '/help',
    //   subItems: [
    //     {
    //       name: 'Guide',
    //       to: '/ipfs/QmRumrGFrqxayDpySEkhjZS1WEtMyJcfXiqeVsngqig3ak',
    //     },
    //     { name: 'story', to: '/genesis' },
    //     {
    //       name: 'vision',
    //       to: '/ipfs/QmXzGkfxZV2fzpFmq7CjAYsYL1M581ZD4yuF9jztPVTpCn',
    //     },
    //     {
    //       name: 'great web',
    //       to: '/ipfs/QmUamt7diQP54eRnmzqMZNEtXNTzbgkQvZuBsgM6qvbd57',
    //     },
    //     {
    //       name: 'vs govs',
    //       to: '/ipfs/QmPmJ4JwzCi82HZp7adtv5GVBFTsKF5Yoy43wshHH7x3ty',
    //     },
    //     {
    //       name: 'vs corps',
    //       to: '/ipfs/QmQvKF9Jb6QKmsqHJzEZJUfcbB9aBBKwa5dh3pMxYEj7oi',
    //     },
    //     {
    //       name: 'roadmap',
    //       to: '/ipfs/QmSBYCCYFNfHNQD7MWm4zBaNuztMaT2KghA2SbeZZm9vLH',
    //     },
    //     {
    //       name: 'distribution',
    //       to: '/ipfs/QmVPgNeay23Ae5itAamMcr4iEAUKuhw5qD9U1zNqN4gpew',
    //     },
    //     {
    //       name: 'gift',
    //       to: '/ipfs/QmPAi1h1rwWnHkNnxnHZg28eGivpUK8wy8eciqoPSR4PHv',
    //     },
    //     {
    //       name: 'congress',
    //       to: '/network/bostrom/contract/bostrom1xszmhkfjs3s00z2nvtn7evqxw3dtus6yr8e4pw',
    //     },
    //   ],
    // },
  ];

  if (CYBER.CHAIN_ID === 'bostrom') {
    listItemMenu.splice(2, 0, {
      name: 'Portal',
      icon: portal,
      to: '/portal',
      subItems: [
        { name: 'Citizenship', to: '/citizenship' },
        { name: 'Gift', to: '/gift' },
        // { name: 'Release', to: '/release' },
      ],
    });
  }
  return listItemMenu;
};

const AppMenu = ({ addressActive }) => {
  return (
    <MenuContainer>
      <Bookmarks items={itemsMenu(addressActive)} />
      <ReportLinkContainer />
    </MenuContainer>
  );
};

export default AppMenu;
