import { formatNumber, getDisplayAmount } from 'src/utils/utils';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import { Nullable } from 'src/types';
import { ObjKeyValue } from 'src/types/data';
import { useMemo } from 'react';
import styles from './styles.module.scss';
import LinearGradientContainer, {
  Color,
} from '../LinearGradientContainer/LinearGradientContainer';
import { Dots } from '../ui/Dots';

type Props = {
  accountBalances: Nullable<ObjKeyValue>;
  token: string;
  title?: string;
};

function AvailableAmount({
  accountBalances,
  token,
  title = 'available amount',
}: Props) {
  const { traseDenom } = useIbcDenom();

  const useAvailableAmount = useMemo(() => {
    if (token && accountBalances?.[token] && traseDenom) {
      const [{ coinDecimals }] = traseDenom(token);

      return getDisplayAmount(accountBalances[token], coinDecimals);
    }

    return 0;
  }, [accountBalances, token, traseDenom]);

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
