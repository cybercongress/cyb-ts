import { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import getMenuItems from 'src/utils/appsMenu/appsMenu';
import styles from './MobileMenu.module.scss';
import cx from 'classnames';
import useOnClickOutside from 'src/hooks/useOnClickOutside';
import { useActiveMenuItem } from 'src/hooks/useActiveMenuItem';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const { isActiveItem, activeItem } = useActiveMenuItem(getMenuItems());

  useOnClickOutside(menuRef, () => setIsOpen(false));

  return (
    <div
      ref={menuRef}
      className={cx(styles.mobileMenu, { [styles.open]: isOpen })}
    >
      <div className={cx(styles.menuContent, { [styles.visible]: isOpen })}>
        <button
          className={cx(styles.menuButton, { [styles.active]: isOpen })}
          onClick={toggleMenu}
        >
          <img
            src={activeItem?.icon}
            className={styles.icon}
            alt={`${activeItem?.name} menu active icon`}
          />
        </button>
        {getMenuItems().map((item, index) => {
          const isExternal = item.to.startsWith('http');
          return (
            !isActiveItem(item) && (
              <NavLink
                key={index}
                to={item.to}
                className={styles.menuItem}
                onClick={toggleMenu}
                {...(isExternal && {
                  target: '_blank',
                  rel: 'noreferrer noopener',
                })}
              >
                <img
                  src={item.icon}
                  className={styles.icon}
                  alt={`${item.name} menu icon`}
                />
                {isExternal && <span className={styles.external}></span>}
              </NavLink>
            )
          );
        })}
      </div>
    </div>
  );
};

export default MobileMenu;
