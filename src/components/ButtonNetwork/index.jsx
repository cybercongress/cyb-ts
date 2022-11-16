import React from 'react';
import styles from './styles.scss';

const cx = require('classnames');

function ButtonNetwork({ children, onClick, disabled, network }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cx(styles.buttonNetwork, {
        [styles.buttonNetworkBostrom]: network === 'bostrom',
        [styles.buttonNetworkSpacePussy]: network === 'space-pussy',
      })}
    >
      <span className={styles.buttonNetworkSpan}>Switch to </span>
      {network}
    </button>
  );
}

export default ButtonNetwork;
