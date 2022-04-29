import React from 'react';
import styles from './styles.scss';

function MainContainer({ children }) {
  return (
    <main
      style={{ minHeight: 'calc(100vh - 162px)', overflow: 'hidden' }}
      className="block-body"
    >
      <div className={styles.containerContent}>{children}</div>
    </main>
  );
}

export default MainContainer;
