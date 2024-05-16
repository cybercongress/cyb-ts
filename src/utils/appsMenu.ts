import nebulaIcon from 'images/temple/nebula.png';
import teleport from 'images/temple/teleport.png';
import hfr from 'images/temple/hfr.png';
import temple from 'images/temple/temple.png';
import robot from 'images/temple/robot.png';
import shpere from 'images/temple/shpere.png';
import senate from 'images/temple/senate.png';
import portal from 'images/space-pussy.svg';
import oracle from 'images/temple/oracle.png';
import warp from 'images/temple/warp.png';
import hub from 'images/temple/hub.png';
import congress from 'images/congress.png';
import { routes } from 'src/routes';
import { Networks } from 'src/types/networks';
import { CHAIN_ID } from 'src/constants/config';

const itemsMenu = () => {
  const listItemMenu = [
    {
      name: 'My robot',
      icon: robot,
      to: '/robot',
      subItems: [
        { name: 'sense', to: 'sense' },
        { name: 'brain', to: 'brain' },
        { name: 'time', to: 'time' },
        { name: 'sigma', to: 'sigma' },
      ],
      // subItems: myRobotLinks,
    },
    {
      name: 'Oracle',
      to: '/',
      icon: oracle,
      subItems: [
        { name: 'Particles', to: '/particles' },
        { name: 'Stats', to: '/oracle/stats' },
        { name: 'Blocks', to: '/network/bostrom/blocks' },
        { name: 'Txs', to: '/network/bostrom/tx' },
        { name: 'Contracts', to: '/contracts' },
        { name: 'Libs', to: '/libs' },
      ],
    },
    { name: 'Temple', to: routes.temple.path, subItems: [], icon: temple },
    { name: 'Nebula', to: '/nebula', subItems: [], icon: nebulaIcon },
    {
      name: 'Teleport',
      to: '/teleport',
      icon: teleport,
      active: false,
      subItems: [
        { name: 'Send', to: routes.teleport.send.path },
        { name: 'Bridge', to: routes.teleport.bridge.path },
        { name: 'Swap', to: routes.teleport.swap.path },
      ],
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
      to: routes.sphere.path,
      subItems: [{ name: 'Heroes at rest', to: routes.sphereJailed.path }],
    },
    { name: 'HFR', icon: hfr, to: '/hfr', subItems: [] },
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
    { name: 'Senate', icon: senate, to: '/senate', subItems: [] },
    { name: 'About', icon: congress, to: routes.social.path, subItems: [] },
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

  if (CHAIN_ID === Networks.BOSTROM || CHAIN_ID === Networks.SPACE_PUSSY) {
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

export default itemsMenu;
