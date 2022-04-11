import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { trimString, formatNumber } from '../../../../utils/utils';
import ContainerGradient from '../containerGradient/ContainerGradient';
import styles from './styles.scss';

const GIFT_ICON = '🎁';
const BOOT_ICON = '🟢';

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
      {value} {BOOT_ICON}
    </div>
  </div>
);

const TableAllocation = () => {
  return (
    <div className={styles.containerTableAllocation}>
      <ItemTable value={0} title="Astronaut" />
      <ItemTable value={0} title="Average Citizen" />
      <ItemTable value={0} title="Cyberpunk" />
      <ItemTable value={0} title="Extraordinary Hacker" />
      <ItemTable value={0} title="Key Opinion Leader" />
      <ItemTable value={0} title="Devil" />
      <ItemTable value={0} title="Master of the Great Web" />
      <ItemTable value={0} title="Passionate Investor" />
      <ItemTable value={0} title="True Heroe of the Great Web" />
    </div>
  );
};

function CurrentGift({ currentGift, stateOpen }) {
  const useTitle = useMemo(() => {
    if (currentGift && currentGift !== null) {
      const { address, amount } = currentGift;
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
          <div style={{ color: '#36D6AE' }}>{trimString(address, 8, 4)}</div>
          <div>
            {GIFT_ICON} {formatNumber(parseFloat(amount))} {BOOT_ICON}
          </div>
        </div>
      );
    }
    return null;
  }, [currentGift]);

  const useBaseGift = useMemo(() => {
    if (currentGift && currentGift !== null) {
      const { amount } = currentGift;
      return formatNumber(parseFloat(amount));
    }

    return 0;
  }, [currentGift]);

  return (
    <ContainerGradient
      userStyleContent={{ height: '485px' }}
      closedTitle={useTitle}
      title={`${GIFT_ICON} Gift`}
      stateOpen={stateOpen}
    >
      <div className={styles.containerCurrentGift}>
        <div className={styles.containerCurrentGiftContaiterAmountGift}>
          <ItemValue value={`${useBaseGift} ${BOOT_ICON}`} title="base gift" />
          *
          <ItemValue value={0} title="bonus" />
          =
          <ItemValue
            value={`${GIFT_ICON} ${useBaseGift} ${BOOT_ICON}`}
            title="claimable gift"
          />
        </div>
        <div>
          You are the one, who been chosen for good deeds in cyberverse on 5th
          of November 2021:
        </div>
        <TableAllocation />
        <div>
          Please check <Link to="/search/gift">details of the gift</Link>
        </div>
      </div>
    </ContainerGradient>
  );
}

export default CurrentGift;
