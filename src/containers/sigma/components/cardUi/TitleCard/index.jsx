import React from 'react';
import styles from './styles.scss';

function TitleCard() {
  return (
    <div className={styles.container}>
      <div className={styles.avatar}>avatar</div>
      <div className={styles.name}>name</div>
      <div className={styles.total}>total</div>
      <div className={styles.address}>address</div>
    </div>
  );
}

export default TitleCard;
