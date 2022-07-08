import React, { useMemo } from 'react';
import { ContainerGradientText } from '../containerGradient/ContainerGradient';
import { BOOT_ICON, GIFT_ICON } from '../../utils';
import { formatNumber, dhm } from '../../../../utils/utils';
import styles from './styles.scss';

const ItemRow = ({ value, title }) => (
  <div className={styles.containerItemRow}>
    <div>{title}</div>
    <div>{value}</div>
  </div>
);

function NextUnfreeze({ timeNext = '', readyRelease }) {
  try {
    const useTimeNext = useMemo(() => {
      if (timeNext !== null) {
        return (
          <span className={styles.colorTextStatusTimeUnfreeze}>
            {dhm(timeNext)}
          </span>
        );
      }

      if (readyRelease && readyRelease !== null) {
        return (
          <span className={styles.colorTextStatusTimeReady}>
            ready {GIFT_ICON}
          </span>
        );
      }

      return '';
    }, [timeNext, readyRelease]);
    return (
      <ContainerGradientText status="green">
        <div className={styles.containerNextUnfreeze}>
          <ItemRow value={useTimeNext} title="next unfreeze" />
          {/* <ItemRow
            value={`${formatNumber(readyRelease)} ${BOOT_ICON}`}
            title="ready to release"
          /> */}
        </div>
      </ContainerGradientText>
    );
  } catch (error) {
    return (
      <ContainerGradientText status="green">
        <div className={styles.containerNextUnfreeze}>
          <ItemRow value="" title="next unfreeze" />
          {/* <ItemRow value={`0 ${BOOT_ICON}`} title="ready to release" /> */}
        </div>
      </ContainerGradientText>
    );
  }
}

export default NextUnfreeze;
