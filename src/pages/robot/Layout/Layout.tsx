import { NavLink, Outlet } from 'react-router-dom';
import cx from 'classnames';
import { Helmet } from 'react-helmet';
import IconsNumber from 'src/components/IconsNumber/IconsNumber';
import Loader2 from 'src/components/ui/Loader2';
import useGetMenuCounts from './useGetMenuCounts';

import RobotHeader from '../RobotHeader/RobotHeader';
import { useRobotContext } from '../Robot';
import WrappedActionBar from './WrappedActionBar';
import styles from './Layout.module.scss';

type MenuItem = {
  text: string;
  link: string;
  description?: string;
  name?: string;
  icon: string;
};

const links: MenuItem[] = [
  {
    text: 'Sigma',
    link: '.',
    description: 'hydrogen',
    name: 'sigma',
    icon: 'Σ',
    // icon: <img src={icon} />,
  },
  {
    text: 'Timeline',
    link: './timeline',
    name: 'txs',
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
    description: 'tokens',
    icon: '🥇',
  },
  {
    text: 'Items',
    link: './items',
    icon: '🖼',
    description: 'tokens',
  },
  {
    text: 'Security',
    description: 'reward',
    link: './security',
    name: 'rewards',
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
    link: './rights',
    icon: '🙌',
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
    description: '',
    link: './drive',
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
    description: 'news today',
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
    link: './soul',
    // description: 'bytes',
    icon: '👻',
  },
];

function Layout() {
  const { address, isOwner, isLoading, nickname } = useRobotContext();

  const counts = useGetMenuCounts(address);

  function renderLinks(links: MenuItem[], isMirror?: boolean) {
    // if (!params.address && !address) {
    //   return <>&nbsp;</>; // temp
    // }

    return (
      <ul className={styles.links}>
        {links.map((link, index) => {
          let { description, text, icon } = link;
          let count = counts[link.name] || 0;

          if (link.name === 'drive' && counts.drive) {
            const [value, measurement] = counts.drive.split(' ');
            description = measurement;
            count = value;
          }
          const newUser = !isLoading && !address;

          if (newUser && link.name === 'sigma') {
            description = '';
            count = '-';
            icon = '🤖';
            text = 'Robot';
          }

          function selectTag(content: React.ReactNode) {
            if (newUser && !['sigma', 'drive'].includes(link.name)) {
              return (
                <button type="button" className={styles.disabled}>
                  {content}
                </button>
              );
            }

            return (
              <NavLink
                className={({ isActive }) => {
                  return cx({
                    [styles.active]: isActive,
                  });
                }}
                to={link.link}
                end
              >
                {content}
              </NavLink>
            );
          }

          return (
            <li
              key={index}
              className={cx({
                [styles.mirror]: isMirror,
              })}
            >
              {selectTag(
                <>
                  <span className={styles.text}>{text}</span>
                  <span className={styles.count}>
                    {['karma', 'sigma', 'energy', 'rewards'].includes(
                      link.name
                    ) ? (
                      <IconsNumber
                        value={counts[link.name]}
                        type={(() => {
                          switch (link.name) {
                            case 'sigma':
                              return 'hydrogen';

                            case 'rewards':
                              return 'boot';

                            default:
                              return link.name;
                          }
                        })()}
                      />
                    ) : (
                      count
                    )}
                  </span>

                  {/* <span className={styles.new}>+123</span> */}

                  <span className={styles.icon}>{icon}</span>
                  <span className={styles.description}>{description}</span>
                </>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  const splitIndex = 8;

  return (
    <div className={styles.wrapper}>
      <Helmet>
        <title>Robot {nickname || address || ''}</title>
      </Helmet>

      {renderLinks(links.slice(0, splitIndex))}

      <div>
        {isLoading ? (
          <Loader2 />
        ) : (
          <>
            {!isOwner && <RobotHeader />}

            <Outlet />

            <WrappedActionBar />
          </>
        )}
      </div>

      {renderLinks(links.slice(splitIndex, links.length), true)}
    </div>
  );
}

export default Layout;
