import cx from 'classnames';
import styles from './styles.scss';

interface Props {
  children: React.ReactNode;
  openMenu: boolean;
}

function AppSideBar({ children, openMenu }: Props) {
  return (
    <aside
      className={cx(styles.sideBar, {
        [styles.sideBarHide]: !openMenu,
      })}
    >
      {children}
    </aside>
  );
}

export default AppSideBar;
