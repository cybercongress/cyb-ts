import React from 'react';
import cx from 'classnames';
import styles from './styles.module.scss';

interface MainContainerProps {
  children: React.ReactNode;
  minHeight?: string;
  width?: string;

  // temp maybe
  resetMaxWidth?: boolean;
}

function MainContainer({
  children,
  minHeight = 'calc(100vh - 162px)',
  width = '62%',
  resetMaxWidth,
}: MainContainerProps) {
  return (
    <main
      style={{
        minHeight,
        overflow: 'hidden',
      }}
      className={cx('block-body', {
        [styles.noMaxWidth]: resetMaxWidth,
      })}
    >
      <div style={{ width }} className={styles.containerContent}>
        {children}
      </div>
    </main>
  );
}

export default MainContainer;
