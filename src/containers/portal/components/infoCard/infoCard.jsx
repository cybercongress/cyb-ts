import React from 'react';
import styles from './styles.scss';
import eyeLight from '../../../../image/ion-eye-light.svg';

const cx = require('classnames');

function ContainerLampAfter({ status, children }) {
  return (
    <div
      className={cx(styles.containerLampAfter, {
        [styles.containerLampAfterDefault]: !status || status === 'primary',
        [styles.containerLampAfterRed]: status === 'red',
      })}
    >
      {children}
    </div>
  );
}

function ContainerGradienAfter({ status, children }) {
  return (
    <div
      className={cx(styles.containerGradienAfter, {
        [styles.containerGradienAfterDefault]: !status || status === 'primary',
        [styles.containerGradienAfterRed]: status === 'red',
      })}
    >
      {children}
    </div>
  );
}

function InfoCard({ children, status, ...props }) {
  return (
    <ContainerLampAfter status={status}>
      <ContainerGradienAfter status={status}>
        <div className={styles.containerInfoCard} {...props}>
          {children}
        </div>
      </ContainerGradienAfter>
      {/* <div className={styles.triangle} /> */}
    </ContainerLampAfter>
  );
}

export default InfoCard;
