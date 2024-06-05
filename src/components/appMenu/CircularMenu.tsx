import { useState } from 'react';
import itemsMenu from 'src/utils/appsMenu';
import CircularMenuItem from 'src/containers/application/CircularMenuItem';
import styles from './CircularMenu.module.scss';
import { MenuItem } from 'src/types/menu';

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
                return (
                  <li key={index}>
                    <CircularMenuItem
                      item={item}
                      onClick={() => handleItemClick(item)}
                      selected={activeItem?.name === item.name}
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
