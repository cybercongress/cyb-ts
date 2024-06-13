import { useState, useEffect } from 'react';
import itemsMenu from 'src/utils/appsMenu';
import CircularMenuItem from 'src/containers/application/CircularMenuItem';
import styles from './CircularMenu.module.scss';
import { MenuItem } from 'src/types/menu';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';

declare module 'react' {
  interface CSSProperties {
    '--diameter'?: string;
    '--delta'?: string;
  }
}

function CircularMenu({ circleSize }) {
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const chunkSize = 7;
  const linkChunks = _.chunk(itemsMenu(), chunkSize);
  const location = useLocation();

  const calculateDiameter = (index, circleSize) => {
    const menuCircleDiameter = circleSize / 2 + 40 * (index + 1) - 10;
    const nextLevelMenuAngle = index === 1 ? 12 : 0;
    return { menuCircleDiameter, nextLevelMenuAngle };
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
    const activeMenuItem = itemsMenu().find((item) => isActiveItem(item));
    setActiveItem(activeMenuItem || null);
  }, [location]);

  const handleItemClick = (item: MenuItem) => {
    setActiveItem(item);
  };

  return (
    <div>
      {linkChunks.map((chunk, index) => {
        const { menuCircleDiameter, nextLevelMenuAngle } = calculateDiameter(
          index,
          circleSize
        );
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
