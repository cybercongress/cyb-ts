import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { trimString, formatNumber } from '../../../../utils/utils';
import ContainerGradient from '../containerGradient/ContainerGradient';
import styles from './styles.scss';
import { PATTERN_CYBER } from '../../../../utils/config';

const GIFT_ICON = '🎁';
const BOOT_ICON = '🟢';

const keyTable = [
  'Astronaut',
  'Average Citizens',
  'Cyberpunk',
  'Extraordinary Hacker',
  'Key Opinion Leader',
  'Devil',
  'Master of the Great Web',
  'Passionate Investor',
  'True Heroe of the Great Web',
];

const ItemValue = ({ value, title }) => (
  <div className={styles.containerItemValue}>
    <div className={styles.containerItemValueValue}>{value}</div>
    <div className={styles.containerItemValueTitle}>{title}</div>
  </div>
);

const ItemTable = ({ title, value }) => (
  <div className={styles.containerItemTable}>
    <div>{title}</div>
    <div>
      {formatNumber(value)} {BOOT_ICON}
    </div>
  </div>
);

const TableAllocation = ({ currentGift }) => {
  const itemTable = useMemo(() => {
    if (currentGift !== null && currentGift.details) {
      const { details } = currentGift;
      return keyTable.map((item) => {
        const value = details[item] ? details[item].gift * 10 ** 6 : 0;
        return <ItemTable key={item} value={value} title={item} />;
      });
    }
    return keyTable.map((item) => (
      <ItemTable key={item} value={0} title={item} />
    ));
  }, [currentGift]);

  return <div className={styles.containerTableAllocation}>{itemTable}</div>;
};

function CurrentGift({ currentGift, currentBonus, stateOpen }) {
  const useTitle = useMemo(() => {
    if (currentGift && currentGift !== null) {
      const { amount, claim } = currentGift;
      return (
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            zIndex: '1',
            alignItems: 'center',
          }}
        >
          <div style={{ color: '#00C4FF' }}>gift {GIFT_ICON}</div>
          <div>
            {claim
              ? formatNumber(parseFloat(claim))
              : formatNumber(parseFloat(amount))}{' '}
            {BOOT_ICON}
          </div>
        </div>
      );
    }
    return null;
  }, [currentGift]);

  const useBaseGift = useMemo(() => {
    if (currentGift && currentGift !== null) {
      const { amount, baseAmount } = currentGift;
      if (baseAmount) {
        return formatNumber(parseFloat(baseAmount));
      }

      return formatNumber(parseFloat(amount));
    }

    return 0;
  }, [currentGift]);

  const useClaimableGift = useMemo(() => {
    if (currentGift && currentGift !== null) {
      const { amount, claim, address } = currentGift;
      if (claim) {
        return formatNumber(parseFloat(claim));
      }
      if (
        address &&
        !address.match(PATTERN_CYBER) &&
        currentBonus &&
        currentBonus?.current
      ) {
        const multiplier = new BigNumber(parseFloat(currentBonus.current))
          .dp(1, BigNumber.ROUND_FLOOR)
          .toNumber();
        return formatNumber(parseFloat(amount) * multiplier);
      }

      return formatNumber(parseFloat(amount));
    }
    return 0;
  }, [currentGift, currentBonus]);

  const useCurrentBonus = useMemo(() => {
    if (
      currentGift &&
      currentGift !== null &&
      Object.prototype.hasOwnProperty.call(currentGift, 'address') &&
      currentGift.address.match(PATTERN_CYBER)
    ) {
      return '~';
    }

    if (
      currentGift &&
      currentGift !== null &&
      Object.prototype.hasOwnProperty.call(currentGift, 'multiplier')
    ) {
      return new BigNumber(parseFloat(currentGift.multiplier))
        .dp(1, BigNumber.ROUND_FLOOR)
        .toNumber();
    }

    if (currentBonus && currentBonus?.current) {
      return new BigNumber(parseFloat(currentBonus.current))
        .dp(1, BigNumber.ROUND_FLOOR)
        .toNumber();
    }

    return '~';
  }, [currentBonus, currentGift]);

  return (
    <ContainerGradient
      userStyleContent={{ height: '485px' }}
      closedTitle={useTitle}
      title={`Gift ${GIFT_ICON}`}
      stateOpen={stateOpen}
    >
      <div className={styles.containerCurrentGift}>
        <div className={styles.containerCurrentGiftContaiterAmountGift}>
          <ItemValue value={`${useBaseGift} ${BOOT_ICON}`} title="base gift" />
          *
          <ItemValue value={useCurrentBonus} title="bonus" />
          =
          <ItemValue
            value={`${GIFT_ICON} ${useClaimableGift} ${BOOT_ICON}`}
            title="claimable gift"
          />
        </div>
        <div>
          You are the one, who been chosen for good deeds in cyberverse on 5th
          of November 2021:
        </div>
        <TableAllocation currentGift={currentGift} />
        <div>
          Please check <Link to="/search/gift">details of the gift</Link>
        </div>
      </div>
    </ContainerGradient>
  );
}

export default CurrentGift;
