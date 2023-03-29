import { useMemo, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppContext } from '../../../../context';
import tokenList from '../../../../utils/tokenList';
import { exponentialToDecimal } from '../../../../utils/utils';
import { FormatNumberTokens } from '../../../nebula/components';
import { ContainerGradient } from '../../../../components';
import PoolItemsList from './pollItems';
import TitlePool from './TitlePoolCard';
import styles from './styles.scss';

function PoolCard({ pool, totalSupplyData, accountBalances }) {
  const { traseDenom } = useContext(AppContext);

  const [sharesToken, setSharesToken] = useState(null);

  useEffect(() => {
    setSharesToken(null);
    if (
      totalSupplyData !== null &&
      Object.prototype.hasOwnProperty.call(
        totalSupplyData,
        pool.pool_coin_denom
      ) &&
      accountBalances !== null &&
      Object.prototype.hasOwnProperty.call(
        accountBalances,
        pool.pool_coin_denom
      )
    ) {
      const amountTotal = totalSupplyData[pool.pool_coin_denom];
      const amountAccountBalances = accountBalances[pool.pool_coin_denom];
      const procent = (amountAccountBalances / amountTotal) * 100;
      const shares = exponentialToDecimal(procent.toPrecision(2));
      setSharesToken(shares);
    }
  }, [totalSupplyData, pool, accountBalances]);

  const useInactive = useMemo(() => {
    try {
      let status = false;
      const { reserve_coin_denoms: reserveCoinDenoms } = pool;
      if (reserveCoinDenoms && Object.keys(reserveCoinDenoms).length > 0) {
        reserveCoinDenoms.forEach((itemCoin) => {
          if (itemCoin.includes('ibc')) {
            const { denom, path } = traseDenom(itemCoin);
            const result = tokenList.find((item) => item.denom === denom);
            if (result !== undefined) {
              const { counterpartyChainId, destChannelId } = result;
              const pathFromList = `${counterpartyChainId}/${destChannelId}`;
              if (pathFromList !== path) {
                status = true;
              }
            } else {
              status = true;
            }
          }
        });
      }

      return status;
    } catch (error) {
      console.log('error', error);
      return false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool]);

  return (
    <ContainerGradient
      togglingDisable
      userStyleContent={{ minHeight: '120px', height: 'auto' }}
      title={
        <TitlePool useInactive={useInactive} pool={pool} totalCap={pool.cap} />
      }
    >
      <div>
        {pool.reserve_coin_denoms.map((items) => {
          const keyItem = uuidv4();

          return (
            <PoolItemsList key={keyItem} assets={pool.assets} token={items} />
          );
        })}
      </div>

      {sharesToken !== null && (
        <div className={styles.PoolCardContainerMyShares}>
          <div className={styles.PoolCardContainerMySharesTitle}>My share</div>
          <div>
            <FormatNumberTokens value={sharesToken} float customText="%" />
          </div>
        </div>
      )}
    </ContainerGradient>
  );
}

export default PoolCard;
