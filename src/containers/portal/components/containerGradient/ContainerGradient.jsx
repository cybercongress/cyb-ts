import React from 'react';
import styles from './style.scss';
import { trimString } from '../../../../utils/utils'

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
          <div>{trimString(txs, 5, 5)}</div>
          {/* <div>5 min ago</div> */}
          <div>{status}</div>
        </div>
      )}
    </ContainerLamp>
  );
}

export default ContainerGradient;
