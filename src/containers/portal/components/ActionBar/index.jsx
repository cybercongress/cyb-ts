import React from 'react';
import styles from './styles.scss';

function ActionBarCantainer({ children }) {
  return (
    <div className={styles.ActionBarContainer}>
      <div className={styles.ActionBarContainerContent}>{children}</div>
    </div>
  );
}

export default ActionBarCantainer;
