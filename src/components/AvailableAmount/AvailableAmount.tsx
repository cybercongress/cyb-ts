import { formatNumber, getDisplayAmount } from 'src/utils/utils';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import { Nullable } from 'src/types';
import { ObjKeyValue } from 'src/types/data';
import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import styles from './styles.module.scss';
import LinearGradientContainer, {
  Color,
} from '../LinearGradientContainer/LinearGradientContainer';
import { Dots } from '../ui/Dots';

type Props = {
  accountBalances: Nullable<ObjKeyValue>;
  token: string;
  title?: string;
  changeAmount?: string;
};

function AvailableAmount({
  accountBalances,
  token,
  title = 'available amount',
  changeAmount,
}: Props) {
  const { traseDenom } = useIbcDenom();

  const useAvailableAmount = useMemo(() => {
    if (token && accountBalances?.[token] && traseDenom) {
      const [{ coinDecimals }] = traseDenom(token);
      let amount = getDisplayAmount(accountBalances[token], coinDecimals);
      if (changeAmount && new BigNumber(changeAmount).comparedTo(0)) {
        amount = new BigNumber(amount).plus(changeAmount).toNumber();
      }

      if (amount >= 0) {
        return amount;
      }
    }

    return 0;
  }, [accountBalances, token, traseDenom, changeAmount]);

  return (
    <div className={styles.containerAvailableAmount}>
      <LinearGradientContainer color={Color.Black} title={title}>
        <div className={styles.containerValue}>
          {!accountBalances ? <Dots /> : formatNumber(useAvailableAmount)}
        </div>
      </LinearGradientContainer>
    </div>
  );
}

export default AvailableAmount;
