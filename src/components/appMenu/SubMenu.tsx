import { NavLink, useLocation } from 'react-router-dom';
import { MenuItem } from 'src/types/menu';
import { Pane } from '@cybercongress/gravity';
import cx from 'classnames';
import { useMemo } from 'react';
import styles from './SubMenu.module.scss';

interface Props {
  selectedApp: MenuItem;
  closeMenu: () => void;
}

function SubMenu({ selectedApp, closeMenu }: Props) {
  const renderData = useMemo(
    () =>
      selectedApp.subItems.length
        ? [
            {
              name: 'main',
              to: selectedApp.to,
            },
            ...selectedApp.subItems,
          ]
        : [],
    [selectedApp]
  );

  return (
    <div className={styles.subMenu}>
      {renderData.map((item) => (
        <NavLink
          key={item.name}
          to={item.to}
          end
          className={({ isActive }) =>
            cx(styles.bookmarks__item, {
              [styles.active]: isActive,
            })
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
}

export default SubMenu;
