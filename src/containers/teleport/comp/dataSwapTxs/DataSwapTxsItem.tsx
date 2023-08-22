import { Link } from 'react-router-dom';
import rectangle from 'images/rectangle.svg';
import swapImg from 'images/sync-outline.svg';
import { ContainerGradientText } from 'src/components';
import { AmountDenom } from 'src/containers/txs/Activites';
import { FormatNumberTokens } from 'src/containers/nebula/components';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import { getDisplayAmountReverce } from 'src/utils/utils';
import useGetResultSwap from '../../hooks/useGetResultSwap';
import { ResponseTxsByType } from '../../hooks/useGetSendTxsByAddress';
import styles from './styles.module.scss';
import Timestamp from './Timestamp';

function getDataOrder(value, coinDecimalsA: number) {
  const orderPrice = value.order_price;
  const tokenA = value.offer_coin.denom;
  const tokenB = value.demand_coin_denom;
  let counterPairAmount = 0;

  if ([tokenA, tokenB].sort()[0] === tokenA) {
    const swapPrice = 1 / orderPrice;
    counterPairAmount = swapPrice;
  } else {
    const amountTokenA = getDisplayAmountReverce(1, coinDecimalsA);
    counterPairAmount = orderPrice * parseFloat(amountTokenA);
  }

  return {
    counterPairAmount,
  };
}

function DataSwapTxsItem({ item }: { item: ResponseTxsByType }) {
  const { traseDenom } = useIbcDenom();
  const dataResultSwap = useGetResultSwap(
    item.transaction.height,
    item.transaction.logs
  );

  const { value } = item;

  const tokenA = value.offer_coin.denom;
  const tokenAAmount = value.offer_coin.amount;
  const tokenB = value.demand_coin_denom;

  const [{ coinDecimals: coinDecimalsA }] = traseDenom(tokenA);
  const { counterPairAmount } = getDataOrder(value, coinDecimalsA);

  return (
    <Link to={`/network/bostrom/tx/${item.transaction_hash}`}>
      <ContainerGradientText
        status={item.transaction.success ? 'blue' : 'red'}
        userStyleContent={{ display: 'grid', gap: '10px' }}
      >
        <div className={styles.containerTitle}>
          <div className={styles.containerSwapImg}>
            <img src={swapImg} alt="swapImg" /> <span>swap</span>
          </div>
          <div className={styles.containerPrice}>
            <FormatNumberTokens text={tokenA} value={1} />
            <img src={rectangle} alt="img" />
            <FormatNumberTokens
              text={tokenB}
              value={counterPairAmount}
              styleContainer={{
                display: 'flex',
                flexDirection: 'row-reverse',
              }}
            />
          </div>
        </div>
        <div className={styles.containerContent}>
          <Timestamp timestamp={item.transaction.block.timestamp} />
          <div>{dataResultSwap?.success && dataResultSwap.success}</div>
          <div className={styles.containerAmountCoins}>
            <AmountDenom
              denom={tokenA}
              amountValue={tokenAAmount}
              styleValue={{ color: '#FF5C00' }}
            />
            {dataResultSwap?.demandCoin && (
              <AmountDenom
                denom={dataResultSwap.demandCoin.denom}
                amountValue={dataResultSwap.demandCoin.amount}
                styleValue={{ color: '#76FF03' }}
              />
            )}
          </div>
        </div>
      </ContainerGradientText>
    </Link>
  );
}

export default DataSwapTxsItem;
