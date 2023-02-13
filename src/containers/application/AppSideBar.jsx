import React from 'react';
import cx from 'classnames';
import styles from './styles.scss';

const AppSideBar = ({ children, onCloseSidebar, openMenu }) => (
  <div
    className={cx(styles.sideBar, {
      [styles.sideBarHide]: !openMenu,
    })}
  >
    {children}
  </div>
);

export default AppSideBar;
