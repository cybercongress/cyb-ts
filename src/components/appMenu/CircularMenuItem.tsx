import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import styles from './CircularMenu.module.scss';
import { MenuItem } from 'src/types/menu';
import AdviserHoverWrapper from 'src/features/adviser/AdviserHoverWrapper/AdviserHoverWrapper';

interface Props {
  item: MenuItem;
  onClick: () => void;
  selected: boolean;
}

const CircularMenuItem = ({ item, onClick, selected }: Props) => {
  const isExternal = item.to.startsWith('http');

  return (
    <div className={cx(styles.menu_item, { [styles.active]: selected })}>
      <AdviserHoverWrapper adviserContent={item.name}>
        <NavLink
          to={item.to}
          onClick={onClick}
          style={{ position: 'inherit' }}
          {...(isExternal && { target: '_blank', rel: 'noreferrer noopener' })}
        >
          <img src={item.icon} className={styles.icon} alt="img" />
          {isExternal && <span className={styles.external}></span>}
        </NavLink>
      </AdviserHoverWrapper>
    </div>
  );
};

export default CircularMenuItem;
