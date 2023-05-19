import React from 'react';
import { Link, NavLink, Navigate, Outlet, useParams } from 'react-router-dom';
import { ContainerGradientText, Tooltip } from 'src/components';
import styles from './Layout.module.scss';
import cx from 'classnames';
import useGetAddressTemp from 'src/containers/account/hooks/useGetAddressTemp';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { Helmet } from 'react-helmet';

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
    icon: '🟢',
  },
  {
    text: 'Drive',
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
    icon: '∑',
  },

  {
    text: 'Energy',
    link: './energy',
    icon: '🚀',
  },
  {
    text: 'Swarm',
    link: './swarm',
    icon: '💚',
  },
  {
    text: 'Log',
    link: './log',
    icon: '🍀',
  },
  {
    text: 'Badges',
    link: './badges',
  },
  {
    text: 'Sense',
    link: './sense',
    icon: '🧬',
  },
  {
    text: 'Brain',
    link: './brain',
    icon: '🧠',
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

  const account = defaultAccount.account?.cyber.bech32;
  const isOwner = account === params.address;

  function renderLinks(links) {
    if (!params.address && !account) {
      return <>&nbsp;</>; // temp
    }

    return (
      <ul className={styles.links}>
        {links.map((link, index) => {
          if (link.onlyOwner && !isOwner) {
            return null;
          }

          return (
            <li key={index}>
              {/* <Tooltip tooltip={link.text} placement="top"> */}

              {
                ['Nft', 'Karma', 'Keys', 'Skills'].includes(link.text) ? (
                  <span>{link.text}</span>
                ) : (
                  <NavLink
                    end
                    className={({ isActive }) => {
                      return cx({ [styles.active]: isActive });
                    }}
                    to={link.link}
                  >
                    {link.text} <span>{link.icon}</span>
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
      <Helmet>
        <title>Robot: {account || ''}</title>
      </Helmet>
      {renderLinks(links.slice(0, 7))}

      {/* <ContainerGradientText> */}
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

      {/* <div
          style={{
            padding: '10px 30px',
          }}
        > */}

      {/* </div> */}
      {/* </ContainerGradientText> */}
      {renderLinks(links.slice(7, links.length))}
    </div>
  );
}

export default Layout;
