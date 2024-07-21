import { useState, useEffect, useRef } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import itemsMenu from 'src/utils/appsMenu';
import styles from './MobileMenu.module.scss';
import { MenuItem } from 'src/types/menu';
import cx from 'classnames';
import useOnClickOutside from 'src/hooks/useOnClickOutside';
const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActiveItem = (item: MenuItem) => {
    if (location.pathname === item.to) {
      return true;
    }
    if (
      item.to === '/robot' &&
      (location.pathname.includes('@') || location.pathname.includes('neuron/'))
    ) {
      return true;
    }
    if (item.to === '/senate' && location.pathname.startsWith('/senate/')) {
      return true;
    }
    return item.subItems?.some((subItem) => location.pathname === subItem.to);
  };

  useEffect(() => {
    const activeMenuItem = itemsMenu().find((item) => isActiveItem(item));
    setActiveItem(activeMenuItem || null);
  }, [location]);

  useOnClickOutside(menuRef, () => setIsOpen(false));

  return (
    <div
      ref={menuRef}
      className={cx(styles.mobileMenu, {
        [styles.open]: isOpen,
        [styles.closed]: !isOpen,
      })}
    >
      <div
        className={cx(styles.menuContent, {
          [styles.visible]: isOpen,
          [styles.hidden]: !isOpen,
        })}
      >
        <button
          className={cx(styles.menuButton, { [styles.active]: isOpen })}
          onClick={toggleMenu}
        >
          <img src={activeItem?.icon} className={styles.icon} alt="menu icon" />
        </button>
        {itemsMenu().map((item, index) => {
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
                  alt="menu item icon"
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
