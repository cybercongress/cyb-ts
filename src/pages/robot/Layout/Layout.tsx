import { NavLink, Outlet, useParams } from 'react-router-dom';
import styles from './Layout.module.scss';
import cx from 'classnames';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { Helmet } from 'react-helmet';
import useGetMenuCounts from './useGetMenuCounts';

import icon from './icon.svg';
import IconsNumber from 'src/components/IconsNumber/IconsNumber';
import RobotHeader from '../RobotHeader/RobotHeader';
import { useRobotContext } from '../Robot';
import ActionBar from 'src/containers/account/actionBar';
import WrappedActionBar from './WrappedActionBar';
import Loader2 from 'src/components/ui/Loader2';

const links = [
  {
    text: 'Sigma',
    link: '.',
    description: 'hydrogen',
    name: 'sigma',
    icon: <img src={icon} />,
  },
  {
    text: 'Timeline',
    link: './timeline',
    description: 'txs',
    icon: '🚥',
  },
  {
    text: 'Chat',
    link: './chat',
    icon: '💬',
    description: 'msg',
  },
  {
    text: 'Badges',
    link: './badges',
    name: 'badges',
    description: 'badges',
    icon: '🥇',
  },
  {
    text: 'Items',
    link: './items',
    icon: '🖼',
    description: 'items',
  },
  {
    text: 'Security',
    description: 'heroes',
    link: './security',
    name: 'security',
    icon: '🧑🏼‍🚀',
  },
  {
    text: 'Skills',
    link: './skills',
    description: 'active',
    icon: '🍄',
  },
  {
    text: 'Rights',
    isDisabled: true,
    icon: '📜',
  },

  // second menu

  {
    text: 'Energy',
    link: './energy',
    name: 'energy',
    description: 'watt',
    icon: '🚀',
  },
  {
    text: 'Drive',
    name: 'drive',
    description: 'mb',
    link: './drive',
    onlyOwner: true,
    icon: '🟥',
  },
  {
    text: 'Swarm',
    link: './swarm',
    description: 'learners',
    name: 'swarm',
    icon: '💚',
  },

  {
    text: 'Sense',
    link: './sense',
    icon: '🧬',
    description: 'news',
    name: 'sense',
  },
  {
    text: 'Brain',
    link: './brain',
    icon: '🧠',
    description: 'cyberlinks',
    name: 'cyberlinks',
  },
  {
    text: 'Log',
    link: './log',
    name: 'log',
    description: 'tweets',
    icon: '🍀',
  },
  {
    text: 'Karma',
    link: './karma',
    name: 'karma',
    description: 'points',
    icon: '🔮',
  },
  {
    text: 'Soul',
    // link: './soul',
    isDisabled: true,
    description: 'bytes',
    icon: '👻',
  },
];

function Layout() {
  const { address, isOwner } = useRobotContext();

  const counts = useGetMenuCounts(address);

  function renderLinks(links, isMirror?: boolean) {
    // if (!params.address && !address) {
    //   return <>&nbsp;</>; // temp
    // }

    return (
      // div for sticky css working
      <div>
        <ul className={styles.links}>
          {links.map((link, index) => {
            if (link.onlyOwner && !isOwner) {
              return null;
            }

            return (
              <li key={index} className={cx({ [styles.mirror]: isMirror })}>
                {link.isDisabled ? (
                  <span className={styles.noLink}>{link.text}</span>
                ) : (
                  <NavLink
                    end
                    className={({ isActive }) => {
                      return cx({
                        [styles.active]: isActive,
                      });
                    }}
                    to={link.link}
                  >
                    {/* <span className={styles.text}>{link.text}</span> */}
                    <span className={styles.count}>
                      {['karma', 'sigma'].includes(link.name) ? (
                        <IconsNumber
                          value={counts[link.name]}
                          type={link.name === 'sigma' ? 'hydrogen' : link.name}
                        />
                      ) : (
                        counts[link.name] || 0
                      )}
                    </span>

                    {/* <span className={styles.new}>+123</span> */}

                    <span className={styles.icon}>{link.icon}</span>
                    <span className={styles.description}>
                      {link.description}
                    </span>
                  </NavLink>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  const splitIndex = 8;

  return (
    <div className={styles.wrapper}>
      <Helmet>
        <title>Robot: {address || ''}</title>
      </Helmet>

      {renderLinks(links.slice(0, splitIndex))}

      <div>
        {address ? (
          <>
            {!isOwner && <RobotHeader />}

            <Outlet />

            <WrappedActionBar />
          </>
        ) : (
          <Loader2 />
        )}
      </div>

      {renderLinks(links.slice(splitIndex, links.length), true)}
    </div>
  );
}

export default Layout;
