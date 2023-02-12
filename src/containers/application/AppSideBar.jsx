import React from 'react';
import cx from 'classnames';
import styles from './styles.scss';

const AppSideBar = ({ children, onCloseSidebar, openMenu }) => (
  <div
    className={cx(styles.sideBar, {
      [styles.sideBarHide]: !openMenu,
    })}
  >
    <button
      type="button"
      onClick={onCloseSidebar}
      className={styles.closeButton}
    >
      close
    </button>

    {children}
  </div>
);

export default AppSideBar;
