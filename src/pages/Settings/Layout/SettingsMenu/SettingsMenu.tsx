import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import { Display } from 'src/components';
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
      text: 'Signer',
      link: './signer',
      icon: '🖋️',
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
  // [
  //   {
  //     text: 'Audio',
  //     link: './audio',
  //     icon: '🔊',
  //   },
  // ],
];

function SettingsMenu() {
  return (
    <div className={styles.wrapper}>
      <Display>
        <div className={styles.links}>
          {links.map((link, indexUl) => (
            <ul key={indexUl}>
              {link.map((item, index) => (
                <li key={index}>
                  <NavLink
                    className={({ isActive }) =>
                      cx({
                        [styles.active]: isActive,
                      })
                    }
                    to={item.link}
                    end
                  >
                    <span className={styles.icon}>{item.icon}</span>
                    <span className={styles.text}>{item.text}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </Display>
    </div>
  );
}

export default SettingsMenu;
