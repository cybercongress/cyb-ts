import { NavLink, Outlet, useParams } from 'react-router-dom';
import styles from './Layout.module.scss';
import cx from 'classnames';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { Helmet } from 'react-helmet';
import useGetMenuCounts from './useGetMenuCounts';

import icon from './icon.svg';
import IconsNumber from 'src/components/IconsNumber/IconsNumber';

const links = [
  {
    text: 'Keys',
    link: './keys',
    icon: '🔑',
  },
  {
    text: 'Passport',
    link: './',
    onlyOwner: true,
    name: 'passport',
    icon: '🟢',
  },
  {
    text: 'Drive',
    name: 'drive',
    link: './drive',
    onlyOwner: true,
    icon: '🟥',
  },
  {
    text: 'Timeline',
    link: './timeline',
    icon: '🚥',
  },
  {
    text: 'Nft',
    link: './nft',
    icon: '🖼',
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
    icon: '🍄',
  },
  {
    text: 'Sigma',
    link: './sigma',
    name: 'sigma',
    icon: <img src={icon} />,
  },

  {
    text: 'Energy',
    link: './energy',
    name: 'energy',
    icon: '🚀',
  },
  {
    text: 'Swarm',
    link: './swarm',
    name: 'swarm',
    icon: '💚',
  },
  {
    text: 'Log',
    link: './log',
    name: 'log',
    icon: '🍀',
  },
  {
    text: 'Badges',
    link: './badges',
    name: 'badges',
    icon: '🥇',
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
    text: 'Karma',
    link: './karma',
    icon: '🔮',
  },
];

function Layout() {
  const params = useParams();

  const { defaultAccount } = useSelector((state: RootState) => state.pocket);

  const address = defaultAccount.account?.cyber?.bech32;

  const isOwner = address && address === params.address;

  // temp
  const addr =
    params.address ||
    address ||
    'bostrom1d8754xqa9245pctlfcyv8eah468neqzn3a0y0t';

  const counts = useGetMenuCounts(addr);

  function renderLinks(links, isMirror?: boolean) {
    if (!params.address && !address) {
      return <>&nbsp;</>; // temp
    }

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
                {['Nft', 'Karma', 'Keys', 'Skills'].includes(link.text) ? (
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

  return (
    <div className={styles.wrapper}>
      <Helmet>
        <title>Robot: {address || ''}</title>
      </Helmet>

      {renderLinks(links.slice(0, 7))}

      <div>
        {params.address && (
          <p
            style={{
              marginBottom: '20px',
            }}
          >
            {params.address} (name)
          </p>
        )}

        <Outlet />
      </div>

      {renderLinks(links.slice(7, links.length), true)}
    </div>
  );
}

export default Layout;
