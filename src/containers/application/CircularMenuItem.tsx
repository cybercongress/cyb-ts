import { NavLink } from 'react-router-dom';
import styles from 'src/components/appMenu/CircularMenu.module.scss';

interface Props {
  selected: boolean;
  onClick: () => void;
}

function CircularMenuItem({ item, selected, onClick }: Props) {
  return (
    <div className={styles.menu_item}>
      <NavLink to={item.to} onClick={onClick} style={{ position: 'inherit' }}>
        <img
          src={item.icon}
          style={{ width: 30, height: 30, objectFit: 'fill' }}
          alt="img"
        />
      </NavLink>
    </div>
  );
}

export default CircularMenuItem;
