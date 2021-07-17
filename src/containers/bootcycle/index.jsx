import React from 'react';
import { CYBER } from '../../utils/config';
import styles from '../../style/bootcycle.scss';

const ItemCycle = ({ text, value, currency, color = '#9e9e9e' }) => {
  return (
    <div
      style={{ boxShadow: `0 0 4px 1px ${color}` }}
      className={styles.cycleItemContainer}
    >
      <div>{text}</div>
      <div className={styles.cycleItemValue}>{value}</div>
      <div className={styles.cycleItemCurrency}>{currency}</div>
    </div>
  );
};

function Bootcycle({ defaultAccount }) {
  // const [activeAddress, setActiveAddress] = useState(null);
  // const { balance, loadingBalanceInfo } = useGetBalance(address, updateAddress);

  // useEffect(() => {
  //   const chekAddress = async () => {
  //     const { account } = defaultAccount;
  //     if (
  //       account !== null &&
  //       Object.prototype.hasOwnProperty.call(account, 'cyber')
  //     ) {
  //       const { keys } = account.cyber;
  //       if (keys !== 'read-only') {
  //         if (account.cyber.bech32 === address) {
  //           setFollow(false);
  //           setTweets(true);
  //           setActiveAddress({ ...account.cyber });
  //         } else {
  //           setFollow(true);
  //           setTweets(false);
  //           setActiveAddress({ ...account.cyber });
  //         }
  //       } else {
  //         setActiveAddress(null);
  //       }
  //     } else {
  //       setActiveAddress(null);
  //     }
  //   };
  //   chekAddress();
  // }, [defaultAccount.name, address]);

  return (
    <div className={styles.bootcycleContainer}>
      <div className={styles.itemsSycleWrapper}>
        <ItemCycle text="Energy" value={0} currency="W" color="#2979ff" />
        Matter
        <ItemCycle
          text="Plasma"
          value={0}
          currency={CYBER.DENOM_CYBER.toUpperCase()}
          color="#ff9100"
        />
        <ItemCycle
          text="Vapor"
          value={0}
          currency={CYBER.DENOM_CYBER.toUpperCase()}
        />
        <ItemCycle
          text="Liquid"
          value={0}
          currency={CYBER.DENOM_CYBER.toUpperCase()}
          color="#1de9b6"
        />
        <ItemCycle
          text="Ice"
          value={0}
          currency={CYBER.DENOM_CYBER.toUpperCase()}
          color="#00e5ff"
        />
      </div>
    </div>
  );
}

export default Bootcycle;
