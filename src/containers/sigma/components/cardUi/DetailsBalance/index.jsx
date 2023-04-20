import BigNumber from 'bignumber.js';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import { CYBER } from '../../../../../utils/config';
import { convertAmount } from '../../../../../utils/utils';
import RowItem from './RowItem';
import styles from './styles.scss';

// const testData = {
//   liquid: '1 102 102 102 102',
//   frozen: 102,
//   melting: 102,
//   growth: 102,
//   total: 100231,
// };

function DetailsBalance({ data }) {
  const { traseDenom } = useIbcDenom();
  const { price } = data;

  return (
    <div className={styles.containerDetailsBalance}>
      {Object.keys(data)
        .filter(
          (valueKey) =>
            valueKey !== 'total' && valueKey !== 'cap' && valueKey !== 'price'
        )
        .map((key) => {
          const { amount, denom } = data[key];
          const value = { amount, denom };
          const [{ coinDecimals }] = traseDenom(denom);
          value.amount = convertAmount(amount, coinDecimals);
          const cap = new BigNumber(value.amount)
            .multipliedBy(price.amount)
            .dp(0, BigNumber.ROUND_FLOOR)
            .toNumber();

          return (
            <RowItem
              key={key}
              value={value}
              text={key}
              cap={{ amount: cap, denom: CYBER.DENOM_LIQUID_TOKEN }}
            />
          );
        })}
    </div>
  );
}

export default DetailsBalance;
