import React from 'react';
// import classnames from 'classnames';
import styles from './styles.scss';
import stylesLinear from './stylesLinear.scss';

const classNames = require('classnames');

export const LinearGradientContainer = ({ children, ...props }) => {
  return (
    <div className={stylesLinear.textbox} {...props}>
      <div className={stylesLinear.textboxBox}>
        <div className={classNames(stylesLinear.textboxFace)} />
        <div
          className={classNames(
            stylesLinear.textboxFace,
            stylesLinear.textboxTriangles
          )}
        />
        <div
          className={classNames(
            stylesLinear.textboxFace,
            stylesLinear.textboxBottomGradient
          )}
        />
        <div
          className={classNames(
            stylesLinear.textboxFace,
            stylesLinear.textboxBottomLine
          )}
        />
        {/* <div className={stylesLinear.textboxField}>{children}</div> */}
      </div>
    </div>
  );
};

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

// function Input({ ...props }) {
//   return (
//     <LinearGradientContainer>
//       <input className={styles.textboxText} type="text" {...props} />
//     </LinearGradientContainer>
//   );
// }

export default Input;
