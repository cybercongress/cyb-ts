import React from 'react';
// import classnames from 'classnames';
import styles from './styles.scss';

const classNames = require('classnames');

function Input({ ...props }) {
  return (
    <div className={styles.textbox}>
      <div className={styles.textboxBox}>
        <div className={classNames(styles.textboxFace)} />
        <div
          className={classNames(styles.textboxFace, styles.textboxTriangles)}
        />
        <div
          className={classNames(
            styles.textboxFace,
            styles.textboxBottomGradient
          )}
        />
        <div
          className={classNames(styles.textboxFace, styles.textboxBottomLine)}
        />
        <div className={styles.textboxField}>
          <input className={styles.textboxText} type="text" {...props} />
        </div>
      </div>
    </div>
  );
}

export default Input;
