import React from 'react';
import styles from './styles.scss';

interface MainContainerProps {
  children: React.ReactNode;
  minHeight?: string;
  width?: string;
}

function MainContainer({
  children,
  minHeight = 'calc(100vh - 162px)',
  width = '62%',
}: MainContainerProps) {
  return (
    <main
      style={{
        minHeight,
        overflow: 'hidden',
      }}
      className="block-body"
    >
      <div style={{ width }} className={styles.containerContent}>
        {children}
      </div>
    </main>
  );
}

export default MainContainer;
