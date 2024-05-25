import React from 'react';
import { useCybernet } from '../../../cybernet.context';
import { AmountDenom } from 'src/components';
import styles from './Banner.module.scss';

function Banner() {
  const { contracts } = useCybernet();

  const totalPaid = contracts.reduce(
    (acc, contract) => acc + Number(contract.economy?.total_rewards?.amount),
    0
  );

  return (
    <div className={styles.banner}>
      <h2>teaching and learning must be rewarded</h2>

      {totalPaid && (
        <div className={styles.rewardsBlock}>
          <span>
            <AmountDenom amountValue={totalPaid} denom="pussy" />
          </span>
          <span>rewards payed</span>
        </div>
      )}

      <h1>cyberver</h1>
    </div>
  );
}

export default Banner;
