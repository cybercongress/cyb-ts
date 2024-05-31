import { Networks } from 'src/types/networks';
import { Bookmarks } from '../../components/appMenu/AppMenu';

// import nebulaIcon from '../../image/temple/nebula.png';
import teleport from '../../image/temple/teleport.png';
import hfr from '../../image/temple/hfr.png';
import temple from '../../image/temple/temple.png';
import robot from '../../image/temple/robot.png';
import shpere from '../../image/temple/shpere.png';
import senate from '../../image/temple/senate.png';
import portal from '../../image/space-pussy.svg';
import oracle from '../../image/temple/oracle.png';
// import warp from '../../image/temple/warp.png';
// import hub from '../../image/temple/hub.png';
// import congress from './images/congress.png';

import { routes } from '../../routes';
import { cybernetRoutes } from 'src/features/cybernet/ui/routes';
import { CHAIN_ID } from 'src/constants/config';

const itemsMenu = () => {
  const listItemMenu = [
    {
      name: 'cyberver',
      icon: temple,
      to: '/cyberver',
      subItems: [
        {
          name: '👑  board',
          to: '/cyberver/faculties/board',
          // not good, fix
          matchPathname: cybernetRoutes.subnet.path.replace(
            ':nameOrUid',
            'board'
          ),
        },
        {
          name: '🏫  faculties',
          to: '/cyberver/faculties',
          matchPathname: cybernetRoutes.subnets.path,
        },
        {
          name: '💼  mentors',
          to: '/cyberver/mentors',
          matchPathname: cybernetRoutes.delegators.path,
        },
        {
          name: '👨‍🎓  my mentor',
          to: '/cyberver/mentors/my',
          matchPathname: cybernetRoutes.myMentor.path,
        },
        {
          name: '👨‍🎓  my learner',
          to: '/cyberver/learners/my',
          matchPathname: cybernetRoutes.myLearner.path,
        },
        {
          name: '𝚺 sigma',
          to: '/cyberver/sigma',
        },
      ],
    },
    {
      name: 'My account',
      icon: robot,
      to: '/robot',
      subItems: [],
      // subItems: myRobotLinks,
    },
    {
      name: 'Explorer',
      to: '/oracle/stats',
      icon: oracle,
      subItems: [
        { name: 'Assets', to: '/nebula' },
        { name: 'Particles', to: '/particles' },
        { name: 'Contracts', to: '/contracts' },
        { name: 'Codes', to: '/libs' },
        { name: 'Blocks', to: '/network/bostrom/blocks' },
        { name: 'Txs', to: '/network/bostrom/tx' },
      ],
    },
    // { name: 'Temple', to: routes.temple.path, subItems: [], icon: temple },
    // { name: 'Assets', to: '/nebula', subItems: [], icon: nebulaIcon },
    {
      name: 'Swap',
      to: '/teleport/swap',
      subItems: [],
      icon: teleport,
      // active: false,
      subItems: [
        { name: 'Pools', to: '/warp' },
        { name: 'Add liquidity', to: '/warp/add-liquidity' },
        { name: 'Create pool', to: '/warp/create-pool' },
        { name: 'Sub liquidity', to: '/warp/sub-liquidity' },
        // { name: 'Swap', to: routes.teleport.swap.path },
        // { name: 'Bridge', to: routes.teleport.bridge.path },
        // { name: 'Send', to: routes.teleport.send.path },
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
      subItems: [{ name: 'Heroes at rest', to: routes.sphereJailed.path }],
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
        { name: 'Citizenship', to: '/citizenship' },
        { name: 'Gift', to: '/gift' },
        // { name: 'Release', to: '/release' },
      ],
    });
  }
  return listItemMenu;
};

export type MenuItems = ReturnType<typeof itemsMenu>;
export type MenuItem = MenuItems[0];

function AppMenu({ addressActive, closeMenu }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Bookmarks items={itemsMenu(addressActive)} closeMenu={closeMenu} />
    </div>
  );
}

export default AppMenu;
