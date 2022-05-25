import React from 'react';
import { Dots } from '../../../../components';
import styles from './styles.scss';

const GradientContainer = ({ disabled, children }) => {
  return <div className={styles.GradientContainer}>{children}</div>;
};

function BtnGrd({ disabled, text, img, pending, ...props }) {
  return (
    <button
      type="button"
      className={styles.containerBtnGrd}
      disabled={disabled}
      {...props}
    >
      <GradientContainer disabled={disabled}>
        {pending ? (
          <>
            pending <Dots />
          </>
        ) : (
          <>
            {text && text}
            {img && <img alt="img" />}
          </>
        )}
      </GradientContainer>
    </button>
  );
}

export default BtnGrd;
