import cx from 'classnames';
import styles from './styles.scss';

function AppSideBar({ children, openMenu }) {
  return (
    <div
      className={cx(styles.sideBar, {
        [styles.sideBarHide]: !openMenu,
      })}
    >
      {children}
    </div>
  );
}

export default AppSideBar;
