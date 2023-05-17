import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { ContainerGradientText, Tooltip } from 'src/components';
import styles from './Layout.module.scss';
import cx from 'classnames';

const links = [
  {
    text: 'Keys',
    link: '/robot/keys',
  },
  {
    text: 'Passport',
    link: '/robot/passport',
  },
  {
    text: 'Drive',
    link: '/robot/drive',
  },
  {
    text: 'Timeline',
    link: '/robot/timeline',
  },
  {
    text: 'Nft',
    link: '/robot/nft',
  },
  {
    text: 'Security',
    link: '/robot/security',
  },
  {
    text: 'Skills',
    link: '/robot/skills',
  },
  {
    text: 'Sigma',
    link: '/robot/sigma',
  },

  {
    text: 'Energy',
    link: '/robot/energy',
  },
  {
    text: 'Swarm',
    link: '/robot/swarm',
  },
  {
    text: 'Log',
    link: '/robot/log',
  },
  {
    text: 'Badges',
    link: '/robot/badges',
  },
  {
    text: 'Cyberlinks',
    link: '/robot/cyberlinks',
  },
  {
    text: 'Brain',
    link: '/robot/brain',
  },
  {
    text: 'Karma',
    link: '/robot/karma',
  },
];

function Layout() {
  function renderLinks(links) {
    return (
      <ul className={styles.links}>
        {links.map((link, index) => {
          return (
            <li key={index}>
              {/* <Tooltip tooltip={link.text} placement="top"> */}

              {
                ['Nft', 'Karma', 'Keys', 'Skills'].includes(link.text) ? (
                  <span>{link.text}</span>
                ) : (
                  <NavLink
                    className={({ isActive }) => {
                      return cx({ [styles.active]: isActive });
                    }}
                    to={link.link}
                  >
                    {link.text}
                  </NavLink>
                )
                // {/* </Tooltip> */}
              }
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className={styles.wrapper}>
      {renderLinks(links.slice(0, 7))}

      <ContainerGradientText>
        <Outlet />
      </ContainerGradientText>
      {renderLinks(links.slice(7, links.length))}
    </div>
  );
}

export default Layout;
