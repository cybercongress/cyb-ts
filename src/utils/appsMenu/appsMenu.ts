import nebulaIcon from 'images/temple/nebula.png';
import teleport from 'images/temple/teleport.png';
import hfr from 'images/temple/hfr.png';
import robot from 'images/temple/robot.png';
import shpere from 'images/temple/shpere.png';
import senate from 'images/temple/senate.png';
import portal from 'images/space-pussy.svg';
import oracle from 'images/temple/oracle.png';
import warp from 'images/temple/warp.png';
import { routes } from 'src/routes';
import { Networks } from 'src/types/networks';
import { CHAIN_ID } from 'src/constants/config';

const getMenuItems = () => {
  const listItemMenu = [
    {
      name: 'robot',
      icon: robot,
      to: '/robot',
      subItems: [
        { name: 'sense', to: 'sense', icon: require('./images/dna.png') },
        { name: 'brain', to: 'brain', icon: require('./images/brain.png') },
        {
          name: 'time',
          to: 'time',
          icon: require('./images/horizontal-traffic-light.png'),
        },
        { name: 'sigma', to: 'sigma', icon: require('./images/sigma@2x.png') },
      ],
      // subItems: myRobotLinks,
    },
    {
      name: 'Explorer',
      to: '/oracle/stats',
      icon: oracle,
      subItems: [
        {
          name: 'Particles',
          to: '/particles',
          icon: require('./images/tag@2x.png'),
        },
        {
          name: 'Stats',
          to: '/oracle/stats',
          icon: require('./images/avatar@2x.png'),
        },
        {
          name: 'Blocks',
          to: '/network/bostrom/blocks',
          icon: require('./images/gold-blocks.png'),
        },
        {
          name: 'Txs',
          to: '/network/bostrom/tx',
          icon: require('./images/horizontal-traffic-light.png'),
        },
        {
          name: 'Contracts',
          to: '/contracts',
          icon: require('./images/doc@2x.png'),
        },
        { name: 'Libs', to: '/libs', icon: require('./images/database.png') },
      ],
    },
    {
      name: 'Docs',
      to: 'https://docs.cyb.ai',
      subItems: [],
      icon: require('images/temple/autonomous-semantic-programs.png'),
    },
    { name: 'Nebula', to: '/nebula', subItems: [], icon: nebulaIcon },
    {
      name: 'Swap',
      to: '/teleport/swap',
      subItems: [],
      icon: teleport,
      active: false,
      subItems: [
        {
          name: 'Send',
          to: routes.teleport.send.path,
          icon: require('./images/rocket-send@2x.png'),
        },
        {
          name: 'Bridge',
          to: routes.teleport.bridge.path,
          icon: require('./images/arrow-swap@2x.png'),
        },
        {
          name: 'Swap',
          to: routes.teleport.swap.path,
          icon: require('./images/swap.png'),
        },
      ],
    },
    {
      name: 'Warp',
      icon: warp,
      to: '/warp',
      subItems: [
        {
          name: 'Add liquidity',
          to: '/warp/add-liquidity',
          icon: require('images/msgs_ic_pooladd.svg'),
        },
        {
          name: 'Create pool',
          to: '/warp/create-pool',
          icon: require('images/flask-outline.svg'),
        },
        {
          name: 'Sub liquidity',
          to: '/warp/sub-liquidity',
          icon: require('images/msgs_ic_poolremove.svg'),
        },
      ],
    },
    // {
    //   name: 'Pools',
    //   icon: warp,
    //   to: '/warp',
    //   subItems: [
    //     { name: 'Add liquidity', to: '/warp/add-liquidity' },
    //     { name: 'Create pool', to: '/warp/create-pool' },
    //     { name: 'Sub liquidity', to: '/warp/sub-liquidity' },
    //   ],
    // },
    {
      name: 'Stake',
      icon: shpere,
      to: routes.sphere.path,
      subItems: [
        {
          name: 'Heroes at rest',
          to: routes.sphereJailed.path,
          icon: require('./images/astronaut.png'),
        },
      ],
    },
    { name: 'Investmint', icon: hfr, to: '/hfr', subItems: [] },
    // { name: 'Lifeforms', to: '/contracts', subItems: [] },
    // {
    //   name: 'Hub',
    //   to: '/search/hub',
    //   icon: hub,
    //   subItems: [
    //     { name: 'Networks', to: '/networks' },
    //     { name: 'Add network', to: '/networks/add' },
    //   ],
    // },
    // { name: 'Senate', icon: senate, to: '/senate', subItems: [] },
    { name: 'Governance', icon: senate, to: '/senate', subItems: [] },
    // { name: 'About', icon: congress, to: routes.social.path, subItems: [] },
    // { name: 'About', icon: congress, to: routes.social.path, subItems: [] },
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

  if (CHAIN_ID === Networks.BOSTROM) {
    listItemMenu.splice(2, 0, {
      name: 'Portal',
      icon: portal,
      to: '/portal',
      subItems: [
        {
          name: 'Citizenship',
          to: '/citizenship',
          icon: require('./images/identification-card.png'),
        },
        {
          name: 'Gift',
          to: '/gift',
          icon: require('./images/wrapped-gift.png'),
        },
        {
          name: 'Map',
          to: routes.portal.routes.map.path,
          icon: require('./images/world-map.png'),
        },
        // { name: 'Release', to: '/release' },
      ],
    });
  }
  return listItemMenu.filter((item) => item);
};

export default getMenuItems;
