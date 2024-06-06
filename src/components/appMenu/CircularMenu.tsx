import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import itemsMenu from 'src/utils/appsMenu';
import CircularMenuItem from 'src/containers/application/CircularMenuItem';
import styles from './CircularMenu.module.scss';
import { MenuItem } from 'src/types/menu';
import { useLocation } from 'react-router-dom';

declare module 'react' {
  interface CSSProperties {
    '--diameter'?: string;
    '--delta'?: string;
  }
}

function CircularMenu({ circleSize }) {
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const _ = require('lodash');
  const chunkSize = 7;
  const linkChunks = _.chunk(itemsMenu(), chunkSize);

  const location = useLocation();

  function calculateDiameter(index, circleSize) {
    const menuCircleDiameter = circleSize / 2 + 40 * (index + 1) - 10;
    const nextLevelMenuAngle = index === 1 ? 12 : 0;
    return { menuCircleDiameter, nextLevelMenuAngle };
  }

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
        const key = uuidv4();
        return (
          <div
            key={key}
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
              {chunk.map((item) => {
                const isSelected =
                  activeItem?.name === item.name ||
                  location.pathname === item.to;
                return (
                  <li key={uuidv4()}>
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
