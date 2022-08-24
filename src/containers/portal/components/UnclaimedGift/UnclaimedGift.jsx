import React, { useMemo } from 'react';
import { ContainerGradientText } from '../containerGradient/ContainerGradient';
import { BOOT_ICON } from '../../utils';
import { formatNumber } from '../../../../utils/utils';
import styles from './styles.scss';

const ItemRow = ({ value, title }) => (
  <div className={styles.containerItemRow}>
    <div>{title}</div>
    <div>{value}</div>
  </div>
);

function UnclaimedGift({ unClaimedGiftAmount = '' }) {
  try {
    return (
      <ContainerGradientText status="green">
        <div className={styles.containerUnclaimedGift}>
          <ItemRow value={unClaimedGiftAmount} title="unclaimed gift" />
        </div>
      </ContainerGradientText>
    );
  } catch (error) {
    return (
      <ContainerGradientText status="green">
        <div className={styles.containerUnclaimedGift}>
          <ItemRow value="~" title="Unclaimed gift -" />
        </div>
      </ContainerGradientText>
    );
  }
}

export default UnclaimedGift;
