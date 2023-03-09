import React from 'react';
import styles from './styles.scss';

function MainContainer({ children, minHeight, width = '62%', ...props }) {
  return (
    <main
      style={{
        minHeight: minHeight || 'calc(100vh - 162px)',
        overflow: 'hidden',
      }}
      className="block-body"
      {...props}
    >
      <div style={{ width }} className={styles.containerContent}>
        {children}
      </div>
    </main>
  );
}

export default MainContainer;
