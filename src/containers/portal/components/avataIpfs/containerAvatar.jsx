import React from 'react';
import styles from './styles.scss';

const cx = require('classnames');

export const ButtonContainerAvatar = ({ children, uploadNew, ...props }) => {
  return (
    <button
      className={cx(styles.buttonContainerAvatar, { [styles.new]: uploadNew })}
      {...props}
      type="button"
    >
      {children}
    </button>
  );
};

function ContainerAvatar({ children }) {
  return <div className={styles.containetAvatar}>{children}</div>;
}
export default ContainerAvatar;
