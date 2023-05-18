import React from 'react';
import { Link, NavLink, Navigate, Outlet, useParams } from 'react-router-dom';
import { ContainerGradientText, Tooltip } from 'src/components';
import styles from './Layout.module.scss';
import cx from 'classnames';
import useGetAddressTemp from 'src/containers/account/hooks/useGetAddressTemp';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';

const links = [
  {
    text: 'Keys',
    link: './keys',
  },
  {
    text: 'Passport',
    link: './',
    onlyOwner: true,
  },
  {
    text: 'Drive',
    link: './drive',
    onlyOwner: true,
  },
  {
    text: 'Timeline',
    link: './timeline',
  },
  {
    text: 'Nft',
    link: './nft',
  },
  {
    text: 'Security',
    link: './security',
  },
  {
    text: 'Skills',
    link: './skills',
  },
  {
    text: 'Sigma',
    link: './sigma',
  },

  {
    text: 'Energy',
    link: './energy',
  },
  {
    text: 'Swarm',
    link: './swarm',
  },
  {
    text: 'Log',
    link: './log',
  },
  {
    text: 'Badges',
    link: './badges',
  },
  {
    text: 'Cyberlinks',
    link: './cyberlinks',
  },
  {
    text: 'Brain',
    link: './brain',
  },
  {
    text: 'Karma',
    link: './karma',
  },
];

function Layout() {
  const params = useParams();

  const { defaultAccount } = useSelector((state: RootState) => state.pocket);

  const isOwner = defaultAccount.account?.cyber.bech32 === params.address;

  function renderLinks(links) {
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
        <p>{params.address}</p> (name)
        <br />
        <br />
        <br />
        <div
          style={{
            padding: '10px 30px',
          }}
        >
          <Outlet />
        </div>
      </ContainerGradientText>
      {renderLinks(links.slice(7, links.length))}
    </div>
  );
}

export default Layout;
