import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import styles from './SettingsMenu.module.scss';
import { Display } from 'src/components';

type MenuItem = {
  text: string;
  link: string;
  icon: string;
};

const links: Array<MenuItem[]> = [
  [
    {
      text: 'Drive',
      link: '.',
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
      <div className={styles.links}>
        {links.map((link, indexUl) => {
          return (
            <ul key={indexUl}>
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
            </ul>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <Display>{renderLinks(links)}</Display>
    </div>
  );
}

export default SettingsMenu;
