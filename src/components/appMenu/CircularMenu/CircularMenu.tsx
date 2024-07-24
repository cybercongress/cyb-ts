import { useState, useEffect } from 'react';
import getMenuItems from 'src/utils/appsMenu';
import styles from './CircularMenu.module.scss';
import { MenuItem } from 'src/types/menu';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';
import CircularMenuItem from './CircularMenuItem';

declare module 'react' {
  interface CSSProperties {
    '--diameter'?: string;
    '--delta'?: string;
    '--i'?: string;
  }
}

function CircularMenu({ circleSize }) {
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const chunkSize = 7;
  const linkChunks = _.chunk(getMenuItems(), chunkSize);
  const location = useLocation();

  const calculateDiameter = (index, circleSize) => {
    const menuCircleDiameter = circleSize / 2 + 45 * (index + 1) - 10;
    const nextLevelMenuAngle = index === 1 ? -28 : 0; // decreases the angle of second menu layer
    const menuItemsAngle = index === 1 ? 16 : 23; // angle in wich menu items spreads around brain
    return { menuCircleDiameter, nextLevelMenuAngle, menuItemsAngle };
  };

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
    const activeMenuItem = getMenuItems().find((item) => isActiveItem(item));
    setActiveItem(activeMenuItem || null);
  }, [location]);

  const handleItemClick = (item: MenuItem) => {
    setActiveItem(item);
  };

  return (
    <div>
      {linkChunks.map((chunk, index) => {
        const { menuCircleDiameter, nextLevelMenuAngle, menuItemsAngle } =
          calculateDiameter(index, circleSize);
        return (
          <div
            key={index}
            className={styles.circle}
            style={{ width: circleSize, height: circleSize }}
          >
            <div
              className={styles.menu}
              style={{
                '--diameter': `${menuCircleDiameter}px`,
                '--delta': `${nextLevelMenuAngle}deg`,
                '--i': `${menuItemsAngle}deg`,
              }}
            >
              {chunk.map((item, index) => {
                const isSelected = activeItem?.name === item.name;
                return (
                  <li key={index}>
                    <CircularMenuItem
                      item={item}
                      onClick={() => handleItemClick(item)}
                      selected={isSelected}
                    />
                  </li>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CircularMenu;
