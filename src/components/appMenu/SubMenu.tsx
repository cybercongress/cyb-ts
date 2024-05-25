import { useLocation, NavLink } from 'react-router-dom';
import { MenuItem } from 'src/types/menu';
import styles from './SubMenu.module.scss';
import { Pane } from '@cybercongress/gravity';
import cx from 'classnames';

interface Props {
  subItems: MenuItem['subItems'];
  closeMenu: () => void;
}

const SubMenu = ({ subItems, closeMenu }: Props) => {
  const location = useLocation();

  return (
    <div className={styles.subMenu}>
      {subItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.to}
          className={({ isActive }) =>
            cx(styles.bookmarks__item, { [styles.active]: isActive })
          }
          onClick={closeMenu}
        >
          <Pane display="flex" paddingY={5} alignItems="center" key={item.name}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '30px 1fr',
                gap: 10,
                alignItems: 'center',
                paddingLeft: 15,
              }}
            >
              {item.icon && (
                <img
                  src={item.icon}
                  style={{ width: 30, height: 30, objectFit: 'contain' }}
                  alt="img"
                />
              )}
              <Pane
                alignItems="center"
                whiteSpace="nowrap"
                flexGrow={1}
                fontSize={18}
                display="flex"
              >
                {item.name}
              </Pane>
            </div>
          </Pane>
        </NavLink>
      ))}
    </div>
  );
};

export default SubMenu;
