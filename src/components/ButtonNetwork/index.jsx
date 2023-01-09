import React from 'react';
import styles from './styles.scss';

function ButtonNetwork({ onClick, disabled, network }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={styles.buttonNetwork}
    >
      {network}
    </button>
  );
}

export default ButtonNetwork;
