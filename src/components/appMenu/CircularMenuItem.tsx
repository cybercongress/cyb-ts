import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import { MenuItem } from 'src/types/menu';
import styles from './CircularMenuItem.module.scss';

interface Props {
  item: MenuItem;
  onClick: () => void;
  selected: boolean;
}

function CircularMenuItem({ item, onClick, selected }: Props) {
  const isExternal = item.to.startsWith('http');

  return (
    <div className={cx(styles.menu_item, { [styles.active]: selected })}>
      <NavLink
        to={item.to}
        onClick={onClick}
        className={styles.itemContainer}
        {...(isExternal && { target: '_blank', rel: 'noreferrer noopener' })}
      >
        <img src={item.icon} className={styles.icon} alt="img" />
        {isExternal && <span className={styles.external} />}
      </NavLink>
    </div>
  );
}

export default CircularMenuItem;
