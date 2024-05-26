import React from 'react';
import { useCybernet } from '../../../cybernet.context';
import { AmountDenom } from 'src/components';
import styles from './Banner.module.scss';
import { TypingText } from 'src/containers/temple/pages/play/PlayBanerContent';

function Banner() {
  const { contracts } = useCybernet();

  const totalPaid = contracts.reduce(
    (acc, contract) => acc + Number(contract.economy?.total_rewards?.amount),
    0
  );

  return (
    <div className={styles.banner}>
      <h2>
        <TypingText
          content="teaching and learning must be rewarded"
          delay={30}
        />
      </h2>

      {totalPaid && (
        <div className={styles.rewardsBlock}>
          <span>
            <AmountDenom amountValue={totalPaid} denom="pussy" />
          </span>
          <span>rewards payed</span>
        </div>
      )}

      <h1>
        <TypingText content="cyberver" />
      </h1>
    </div>
  );
}

export default Banner;
