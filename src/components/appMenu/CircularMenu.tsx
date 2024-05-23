import styles from 'src/components/appMenu/CircularMenu.module.scss';
import { v4 as uuidv4 } from 'uuid';
import itemsMenu from 'src/utils/appsMenu';
import CircularMenuItem from 'src/containers/application/CircularMenuItem';
declare module 'react' {
  interface CSSProperties {
    '--diameter'?: string;
    '--delta'?: string;
  }
}

function CircularMenu({ circleSize }) {
  const _ = require('lodash');
  const chunkSize = 7;
  const linkChunks = _.chunk(itemsMenu(), chunkSize);

  function calculateDiameter(index, circleSize) {
    const menuCircleDiameter = circleSize / 2 + 40 * (index + 1) - 10;
    const nextLevelMenuAngle = index === 1 ? 12 : 0;
    return { menuCircleDiameter, nextLevelMenuAngle };
  }
  const circularMenus = linkChunks.map((chunk, index) => {
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
            const key = uuidv4();
            return (
              <li key={key}>{item.icon && <CircularMenuItem item={item} />}</li>
            );
          })}
        </div>
      </div>
    );
  });

  return circularMenus;
}

export default CircularMenu;
