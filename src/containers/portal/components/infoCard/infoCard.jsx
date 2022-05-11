import React from 'react';
import styles from './styles.scss';

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

function InfoCard({ children }) {
  return (
    <ContainerLampAfter>
      <ContainerGradienAfter>
        <div className={styles.containerInfoCard}>{children}</div>
      </ContainerGradienAfter>
      {/* <div className={styles.triangle} /> */}
    </ContainerLampAfter>
  );
}

export default InfoCard;
