import React from 'react';
import { ContainerGradientText } from '../containerGradient/ContainerGradient';
import styles from './styles.scss';

const ProgressBar = ({ progress = 0 }) => {
  return (
    <div className={styles.containerProgressBar}>
      <div className={styles.containerProgressBarTrack}>
        <div
          style={{ width: `${progress}%` }}
          className={styles.containerProgressBarTrackProgress}
        >
          <div className={styles.containerProgressBarTrackProgressValue}>
            {progress}%
          </div>
        </div>
      </div>
    </div>
  );
};

function BeforeActivation({ citizens = 0, progress = 0 }) {
  return (
    <ContainerGradientText status="danger">
      <div className={styles.containerBeforeActivation}>
        <div className={styles.containerBeforeActivationTitle}>
          <div>before activation</div>
          <div>{citizens} citizens</div>
        </div>
        <ProgressBar progress={progress} />
        <div className={styles.containerBeforeActivationFooter}>
          <div>0%</div>
          <div style={{ color: '#999999' }}>citizenship registered</div>
          <div>100%</div>
        </div>
      </div>
    </ContainerGradientText>
  );
}

export default BeforeActivation;
