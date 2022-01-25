import React from 'react';
import styles from './style.scss';

const classNames = require('classnames');

const ContainerLamp = ({ children }) => (
  <div className={styles.wrapContainerLamp}>{children}</div>
);

function ContainerGradient({
  title = 'Moon Citizenship',
  children,
  txs,
  status = 'pending',
  danger,
}) {
  return (
    <ContainerLamp>
      <div
        className={classNames(styles.containerContainerGradient, {
          [styles.containerContainerGradientPrimary]: !danger,
          [styles.containerContainerGradientDanger]: danger,
        })}
      >
        <div className={styles.containerContainerGradientTitle}>{title}</div>
        <div
          className={classNames(styles.containerContainerGradientContent, {
            [styles.containerContainerGradientContentPrimary]: !danger,
            [styles.containerContainerGradientContentDanger]: danger,
          })}
        >
          {children}
        </div>
      </div>
      {txs && (
        <div
          className={classNames(styles.containerTxs, {
            [styles.containerTxsPending]: status === 'pending',
            [styles.containerTxsConfirmed]: status === 'confirmed',
          })}
        >
          <div>1J2NF...3K2N</div>
          <div>5 min ago</div>
          <div>pending</div>
        </div>
      )}
    </ContainerLamp>
  );
}

export default ContainerGradient;
