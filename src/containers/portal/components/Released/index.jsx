import React from 'react';
import { ContainerGradientText } from '../containerGradient/ContainerGradient';
import styles from './styles.scss';

function Released({ released = 0 }) {
  return (
    <ContainerGradientText status="danger">
      <div className={styles.containerReleased}>
        <div>released</div>
        <div>{released}%</div>
      </div>
    </ContainerGradientText>
  );
}

export default Released;
