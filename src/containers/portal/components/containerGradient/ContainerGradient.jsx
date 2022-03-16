import React from 'react';
import styles from './style.scss';
import { trimString } from '../../../../utils/utils';

const classNames = require('classnames');

const ContainerLamp = ({ children }) => (
  <div className={styles.wrapContainerLamp}>{children}</div>
);

const TxsStatus = ({ data }) => {
  return (
    <div
      className={classNames(styles.containerTxs, {
        [styles.containerTxsPending]: data.status === 'pending',
        [styles.containerTxsConfirmed]: data.status === 'confirmed',
      })}
    >
      <div>{trimString(data.txHash, 5, 5)}</div>
      {/* <div>5 min ago</div> */}
      <div>{data.status}</div>
    </div>
  );
};

function ContainerGradient({
  title = 'Moon Citizenship',
  children,
  txs,
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
      {txs && txs !== null && <TxsStatus data={txs} />}
    </ContainerLamp>
  );
}

export default ContainerGradient;
