import React from 'react';
import { Transition } from 'react-transition-group';
import styles from './styleBtnPasport.scss';

const cx = require('classnames');

const GradientContainer = ({ styleContent, children }) => {
  return (
    <div
      className={cx(styles.GradientContainer, {
        [styles.GradientContainerBlue]: styleContent === 'blue',
        [styles.GradientContainerDanger]: styleContent === 'red',
      })}
    >
      {children}
    </div>
  );
};

function BtnPasport({ children, typeBtn, ...props }) {
  return (
    <button
      className={cx(styles.BtnPasport, {
        [styles.BtnPasportBlue]: typeBtn === 'blue',
        [styles.BtnPasportRed]: typeBtn === 'red',
      })}
      type="button"
      {...props}
    >
      <GradientContainer styleContent={typeBtn}>{children}</GradientContainer>
    </button>
  );
}

export default BtnPasport;
