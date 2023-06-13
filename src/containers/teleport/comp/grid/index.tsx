import React from 'react';
import styles from './styles.module.scss';

function GridContainer({ children }: { children: React.ReactNode }) {
  return <div className={styles.containerGridContainer}>{children}</div>;
}

function Col({ children }: { children: React.ReactNode }) {
  return <div className={styles.containerCol}>{children}</div>;
}

export { GridContainer, Col };
