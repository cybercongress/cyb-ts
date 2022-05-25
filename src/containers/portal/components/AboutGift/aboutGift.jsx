import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import ContainerGradient from '../containerGradient/ContainerGradient';
import { ProgressBar } from '../progressCard';
import styles from './styles.scss';

function AboutGift({ coefficient }) {
  const useProgress = useMemo(() => {
    if (coefficient && coefficient !== null) {
      const maxValue = coefficient.up - coefficient.down;
      const currentValue = coefficient.current - coefficient.down;
      if (currentValue > 0) {
        const progress = new BigNumber(currentValue).dividedBy(maxValue);
        const curentProcent = new BigNumber(1)
          .minus(progress)
          .multipliedBy(100)
          .dp(1, BigNumber.ROUND_FLOOR)
          .toNumber();
        return curentProcent;
      }
    }
    return 0;
  }, [coefficient]);

  const current = new BigNumber(coefficient.current)
    .dp(1, BigNumber.ROUND_FLOOR)
    .toNumber();

  return (
    <ContainerGradient
      userStyleContent={{ height: '382px' }}
      styleLampContent="purple"
      title="about gift"
    >
      <div>
        70% of BOOT in genesis of Bostrom bootloader allocated to 6 million
        ethereum and 200 thousands cosmos addresses. Gift become releasable
        after 100 000 citizenship registration.
      </div>
      <div className={styles.containerAboutGiftProgressBar}>
        <div className={styles.containerAboutGiftProgressBarTitle}>
          Current bonus
        </div>
        <ProgressBar
          progress={useProgress}
          styleContainer={{ margin: '0', gridGap: '10px' }}
          styleContainerTrack={{ padding: '0' }}
          rotate={8}
          coefficient={coefficient}
          amount={`${current} x`}
        />
        <div className={styles.containerAboutGiftProgressBarFooter}>
          <div>0%</div>
          <div style={{ color: '#999999' }}>tokens claimed</div>
          <div>100%</div>
        </div>
      </div>
      <div>
        Only the most dexterous will catch the luck. The early birds get higher
        bonus.
      </div>
    </ContainerGradient>
  );
}

export default AboutGift;
