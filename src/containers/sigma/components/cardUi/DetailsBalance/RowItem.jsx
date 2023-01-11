import React from 'react';
import { CYBER } from '../../../../../utils/config';
import { FormatNumberTokens } from '../../../../nebula/components';
import styles from './styles.scss';

const iconObj = {
  liquid: '💧',
  frozen: '❄️',
  melting: '☀️',
  growth: '🎋',
  commission: '💫',
};

function RowItem({ text, value, cap }) {
  return (
    <div className={styles.containerRowItem}>
      <div className={styles.containerRowItemValueBalance}>
        <div className={styles.containerRowItemValueBalanceText}>
          {text} {iconObj[text] ? iconObj[text] : ''}
        </div>
        <div className={styles.containerRowItemValueBalanceValue}>
          <FormatNumberTokens value={value.amount} text={value.denom} />
        </div>
      </div>
      <div className={styles.containerRowItemMarket}>
        <FormatNumberTokens value={cap} text={CYBER.DENOM_LIQUID_TOKEN} />
      </div>
    </div>
  );
}

export default RowItem;
