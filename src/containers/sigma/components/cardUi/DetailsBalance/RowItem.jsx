import React from 'react';
import styles from './styles.scss';
import FormatNumberTokens from '../FormatNumberTokens';

const iconObj = {
  liquid: '💧',
  frozen: '❄️',
  melting: '☀️',
  growth: '🎋',
  commission: '💫',
};

function RowItem({ text, value }) {
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
      <div className={styles.containerRowItemMarket}>0</div>
    </div>
  );
}

export default RowItem;
