import BigNumber from 'bignumber.js';
import React from 'react';
import styles from './styles.scss';

const getProcent = (curent, total) => {
  try {
    if (
      new BigNumber(total.amount).comparedTo(0) &&
      new BigNumber(curent.amount).comparedTo(0)
    ) {
      return new BigNumber(curent.amount)
        .dividedBy(total.amount)
        .multipliedBy(100)
        .toNumber();
    }

    return 0;
  } catch (error) {
    return 0;
  }
};

function ChartTotal({ balance }) {
  const { total } = balance;

  if (Object.keys(balance).length >= 4 && total?.amount > 0) {
    return (
      <div className={styles.containerChartTotal}>
        {balance.liquid && (
          <div
            className={styles.containerChartTotalLiquid}
            style={{ width: `${getProcent(balance.liquid, total)}%` }}
          />
        )}
        {balance.frozen && (
          <div
            className={styles.containerChartTotalFrozen}
            style={{ width: `${getProcent(balance.frozen, total)}%` }}
          />
        )}
        {balance.melting && (
          <div
            className={styles.containerChartTotalMelting}
            style={{ width: `${getProcent(balance.melting, total)}%` }}
          />
        )}
        {balance.growth && (
          <div
            className={styles.containerChartTotalGrowth}
            style={{ width: `${getProcent(balance.growth, total)}%` }}
          />
        )}
        {balance.commission && (
          <div
            className={styles.containerChartTotalCommission}
            style={{ width: `${getProcent(balance.commission, total)}%` }}
          />
        )}
      </div>
    );
  }

  return (
    <div className={styles.containerChartTotal}>
      <div
        className={styles.containerChartTotalLiquid}
        style={{ width: `100%` }}
      />
    </div>
  );
}

export default ChartTotal;
