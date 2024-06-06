import { NavLink } from 'react-router-dom';
import styles from 'src/components/appMenu/CircularMenu.module.scss';
import { MenuItem } from 'src/types/menu';

interface Props {
  item: MenuItem;
  onClick: () => void;
  selected: boolean;
}

const CircularMenuItem = ({ item, onClick, selected }: Props) => {
  return (
    <div className={`${styles.menu_item} ${selected ? styles.active : ''}`}>
      <NavLink to={item.to} onClick={onClick} style={{ position: 'inherit' }}>
        <img
          src={item.icon}
          style={{ width: 30, height: 30, objectFit: 'fill' }}
          alt="img"
        />
      </NavLink>
    </div>
  );
};

export default CircularMenuItem;
