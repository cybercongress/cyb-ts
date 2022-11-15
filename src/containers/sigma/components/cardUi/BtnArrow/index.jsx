import React from 'react';
import styles from './styles.scss';
import line22 from '../../../../../image/Line22.svg';

const cx = require('classnames');

function BtnArrow({ disabled, onClick, open }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={styles.btnContainerBtnArrow}
    >
      <img
        src={line22}
        alt="img"
        className={cx(styles.btnContainerBtnArrowImg, {
          [styles.btnContainerBtnArrowImgOpen]: open,
        })}
      />
    </button>
  );
}

export default BtnArrow;
