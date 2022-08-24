import React from 'react';
import styles from './styles.scss';
import eyeLight from '../../../../image/ion-eye-light.svg';

const cx = require('classnames');

const ContainerLampAfter = ({ status, children }) => (
  <div
    className={cx(styles.containerLampAfter, {
      [styles.containerLampAfterDefault]: !status || status === 'primary',
    })}
  >
    {children}
  </div>
);

const ContainerGradienAfter = ({ status, children }) => (
  <div
    className={cx(styles.containerGradienAfter, {
      [styles.containerGradienAfterDefault]: !status || status === 'primary',
    })}
  >
    {children}
  </div>
);

function InfoCard({ children, ...props }) {
  return (
    <ContainerLampAfter>
      <ContainerGradienAfter>
        <div className={styles.containerInfoCard} {...props}>
          {children}
        </div>
      </ContainerGradienAfter>
      {/* <div className={styles.triangle} /> */}
    </ContainerLampAfter>
  );
}

export default InfoCard;
