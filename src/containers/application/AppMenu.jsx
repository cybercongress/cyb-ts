import React, { Component } from 'react';

import {
  MenuContainer,
  AddMenuItem,
  AddMenuItemReject,
  ReportLinkContainer,
  AddMenuItemContainer,
} from '@cybercongress/gravity';

import { Bookmarks } from '../../components/appMenu/AppMenu';
import { fromBech32 } from '../../utils/utils';
import { ButtonNetwork } from '../../components';
import { CYBER } from '../../utils/config';

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

const forEachObjbech32 = (data, prefix) => {
  const newObj = {};
  Object.keys(data).forEach((key) => {
    const valueObj = data[key];
    if (Object.prototype.hasOwnProperty.call(valueObj, 'cyber')) {
      const { bech32 } = valueObj.cyber;
      const bech32NewPrefix = fromBech32(bech32, prefix);
      newObj[key] = {
        ...valueObj,
        cyber: {
          ...valueObj.cyber,
          bech32: bech32NewPrefix,
        },
      };
    }
  });
  return newObj;
};

const updateAddress = async (prefix) => {
  const localStoragePocketAccount = await localStorage.getItem('pocketAccount');
  const localStoragePocket = await localStorage.getItem('pocket');

  if (localStoragePocket !== null) {
    const localStoragePocketData = JSON.parse(localStoragePocket);
    const newObjPocketData = forEachObjbech32(localStoragePocketData, prefix);
    localStorage.setItem('pocket', JSON.stringify(newObjPocketData));
  }
  if (localStoragePocketAccount !== null) {
    const localStoragePocketAccountData = JSON.parse(localStoragePocket);
    const newObjAccountData = forEachObjbech32(
      localStoragePocketAccountData,
      prefix
    );
    localStorage.setItem('pocketAccount', JSON.stringify(newObjAccountData));
  }
};

const AppMenu = ({ addressActive }) => {
  const onClickToBostrom = async () => {
    localStorage.setItem('chainId', 'bostrom');
    await updateAddress('bostrom');
    window.location.reload();
  };

  const onClickToSpacePussy = async () => {
    localStorage.setItem('chainId', 'space-pussy');
    await updateAddress('pussy');
    window.location.reload();
  };

  return (
    <MenuContainer>
      <Bookmarks items={itemsMenu(addressActive)} />
      <ReportLinkContainer>
        {CYBER.CHAIN_ID !== 'bostrom' && (
          <ButtonNetwork
            disabled={CYBER.CHAIN_ID === 'bostrom'}
            onClick={onClickToBostrom}
            network="bostrom"
          />
        )}
        {CYBER.CHAIN_ID !== 'space-pussy' && (
          <ButtonNetwork
            disabled={CYBER.CHAIN_ID === 'space-pussy'}
            onClick={onClickToSpacePussy}
            network="space-pussy"
          />
        )}
      </ReportLinkContainer>
    </MenuContainer>
  );
};

export default AppMenu;
