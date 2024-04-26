import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import styles from './SettingsMenu.module.scss';

type MenuItem = {
  text: string;
  link: string;
  icon: string;
};

const links: Array<MenuItem[]> = [
  [
    {
      text: 'Drive',
      link: './drive',
      icon: '🟥',
    },
  ],
  [
    {
      text: 'Keys',
      link: './keys',
      icon: '🗝',
    },
  ],
  [
    {
      text: 'Tokens',
      link: './tokens',
      icon: '🟢',
    },
    {
      text: 'Networks',
      link: './networks',
      icon: '🌐',
    },
    {
      text: 'Channels',
      link: './channels',
      icon: '📡',
    },
  ],
];

function SettingsMenu() {
  const renderLinks = (links: Array<MenuItem[]>) => {
    return (
      <ul>
        {links.map((link) => {
          return (
            <>
              {link.map((item, index) => {
                return (
                  <li key={index}>
                    <NavLink
                      className={({ isActive }) => {
                        return cx({
                          [styles.active]: isActive,
                        });
                      }}
                      to={item.link}
                      end
                    >
                      <span className={styles.icon}>{item.icon}</span>
                      <span className={styles.text}>{item.text}</span>
                    </NavLink>
                  </li>
                );
              })}
            </>
          );
        })}
      </ul>
    );
  };

  return renderLinks(links);
}

export default SettingsMenu;
