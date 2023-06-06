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

const links = [
  {
    text: 'Sigma',
    link: './',
    name: 'sigma',
    icon: <img src={icon} />,
  },
  {
    text: 'Timeline',
    link: './timeline',
    icon: '🚥',
  },
  {
    text: 'Chat',
    link: './chat',
    icon: '💬',
    isDisabled: true,
  },
  {
    text: 'Badges',
    link: './badges',
    name: 'badges',
    icon: '🥇',
  },
  {
    text: 'Items',
    link: './nft',
    icon: '🖼',
    isDisabled: true,
  },
  {
    text: 'Security',
    link: './security',
    name: 'security',
    icon: '🧑🏼‍🚀',
  },
  {
    text: 'Skills',
    link: './skills',
    isDisabled: true,
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
    icon: '🚀',
  },
  {
    text: 'Drive',
    name: 'drive',
    link: './drive',
    onlyOwner: true,
    icon: '🟥',
  },
  {
    text: 'Swarm',
    link: './swarm',
    name: 'swarm',
    icon: '💚',
  },

  {
    text: 'Sense',
    link: './sense',
    icon: '🧬',
    name: 'sense',
  },
  {
    text: 'Brain',
    link: './brain',
    icon: '🧠',
    name: 'cyberlinks',
  },
  {
    text: 'Log',
    link: './log',
    name: 'log',
    icon: '🍀',
  },
  {
    text: 'Karma',
    link: './karma',
    icon: '🔮',
    isDisabled: true,
  },
];

function Layout() {
  const { defaultAccount } = useSelector((state: RootState) => state.pocket);

  const addressLocal = defaultAccount.account?.cyber?.bech32;

  const { address } = useRobotContext();

  const isOwner = address && address === addressLocal;

  const counts = useGetMenuCounts(address);
  // const counts = {};
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
                {/* <Tooltip tooltip={link.text} placement="top"> */}
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
                    <span className={styles.text}>{link.text}</span>
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
                    <span className={styles.icon}>{link.icon}</span>
                  </NavLink>
                )}
                {/* </Tooltip> */}
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
            <RobotHeader />

            <Outlet />
          </>
        ) : (
          'address loading'
        )}
      </div>

      {renderLinks(links.slice(splitIndex, links.length), true)}
    </div>
  );
}

export default Layout;
