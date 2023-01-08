import React from 'react';
import { CYBER } from '../../../../utils/config';
import { FormatNumberTokens } from '../../../nebula/components';
import { ContainerGradientText } from '../../../portal/components';
import styles from './styles.scss';

const PoolsInfo = ({ totalCap, myCap, useMyProcent }) => {
  return (
    <div className={styles.PoolsInfoContainer}>
      <ContainerGradientText>
        <div className={styles.PoolsInfoContainerValue}>
          <FormatNumberTokens
            styleValue={{ fontSize: '18px' }}
            text={CYBER.DENOM_LIQUID_TOKEN}
            value={myCap}
          />
        </div>

        <div className={styles.PoolsInfoContainerText}>My liquidity</div>
      </ContainerGradientText>
      <ContainerGradientText>
        <div className={styles.PoolsInfoContainerValue}>
          <FormatNumberTokens
            value={totalCap}
            styleValue={{ fontSize: '18px' }}
            text={CYBER.DENOM_LIQUID_TOKEN}
          />
        </div>

        <div className={styles.PoolsInfoContainerText}>Liquidity</div>
      </ContainerGradientText>
      <ContainerGradientText>
        <div className={styles.PoolsInfoContainerValue}>{useMyProcent}%</div>
        <div className={styles.PoolsInfoContainerText}>My share</div>
      </ContainerGradientText>
    </div>
  );
};

export default PoolsInfo;
