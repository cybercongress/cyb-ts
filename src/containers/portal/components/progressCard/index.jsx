import React from 'react';
import { ContainerGradientText } from '../containerGradient/ContainerGradient';
import styles from './styles.scss';

export const ProgressBar = ({
  progress = 0,
  styleContainer,
  styleContainerTrack,
  rotate = 0,
  coefficient,
  amount,
}) => {
  return (
    <div
      className={styles.containerProgressBar}
      style={{ ...styleContainer, transform: `rotate(${rotate}deg)` }}
    >
      {coefficient && (
        <span style={{ transform: `rotate(-${rotate}deg)` }}>
          {coefficient.up}x
        </span>
      )}
      <div
        className={styles.containerProgressBarTrack}
        style={styleContainerTrack}
      >
        <div
          style={{ width: `${progress}%` }}
          className={styles.containerProgressBarTrackProgress}
        >
          <div className={styles.containerProgressBarTrackProgressValue}>
            <span style={{ transform: `rotate(-${rotate}deg)` }}>
              {amount || `${progress}%`}
            </span>
          </div>
        </div>
      </div>
      {coefficient && (
        <span style={{ transform: `rotate(-${rotate}deg)` }}>
          {coefficient.down}x
        </span>
      )}
    </div>
  );
};

// progressCard
// headerTitle
// footerText
// titleValue

function ProgressCard({
  headerText = '',
  footerText = '',
  titleValue = 0,
  progress = 0,
  styleContainerTrack,
}) {
  return (
    <ContainerGradientText status="red">
      <div className={styles.containerBeforeActivation}>
        <div className={styles.containerBeforeActivationTitle}>
          <div>{headerText}</div>
          <div>{titleValue}</div>
        </div>
        <ProgressBar
          progress={progress}
          styleContainerTrack={styleContainerTrack}
        />
        <div className={styles.containerBeforeActivationFooter}>
          <div>0%</div>
          <div style={{ color: '#999999' }}> {footerText}</div>
          <div>100%</div>
        </div>
      </div>
    </ContainerGradientText>
  );
}

export default ProgressCard;
