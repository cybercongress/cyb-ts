import React, { Component } from 'react';

import { MenuContainer, ReportLinkContainer } from '@cybercongress/gravity';

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
    // {
    //   name: 'Portal',
    //   to: '/portal',
    //   subItems: [
    //     { name: 'Citizenship', to: '/citizenship' },
    //     { name: 'Gift', to: '/gift' },
    //     // { name: 'Release', to: '/release' },
    //   ],
    // },
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
    {
      name: 'Help',
      to: '/help',
      subItems: [
        {
          name: 'Guide',
          to: '/ipfs/QmRumrGFrqxayDpySEkhjZS1WEtMyJcfXiqeVsngqig3ak',
        },
        { name: 'story', to: '/genesis' },
        {
          name: 'vision',
          to: '/ipfs/QmXzGkfxZV2fzpFmq7CjAYsYL1M581ZD4yuF9jztPVTpCn',
        },
        {
          name: 'great web',
          to: '/ipfs/QmUamt7diQP54eRnmzqMZNEtXNTzbgkQvZuBsgM6qvbd57',
        },
        {
          name: 'vs govs',
          to: '/ipfs/QmPmJ4JwzCi82HZp7adtv5GVBFTsKF5Yoy43wshHH7x3ty',
        },
        {
          name: 'vs corps',
          to: '/ipfs/QmQvKF9Jb6QKmsqHJzEZJUfcbB9aBBKwa5dh3pMxYEj7oi',
        },
        {
          name: 'roadmap',
          to: '/ipfs/QmSBYCCYFNfHNQD7MWm4zBaNuztMaT2KghA2SbeZZm9vLH',
        },
        {
          name: 'distribution',
          to: '/ipfs/QmVPgNeay23Ae5itAamMcr4iEAUKuhw5qD9U1zNqN4gpew',
        },
        {
          name: 'gift',
          to: '/ipfs/QmPAi1h1rwWnHkNnxnHZg28eGivpUK8wy8eciqoPSR4PHv',
        },
        {
          name: 'congress',
          to: '/network/bostrom/contract/bostrom1xszmhkfjs3s00z2nvtn7evqxw3dtus6yr8e4pw',
        },
      ],
    },
  ];
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
