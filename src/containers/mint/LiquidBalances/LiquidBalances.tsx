import { CYBER } from 'src/utils/config';
import ItemBalance from '../components/ItemBalance/ItemBalance';
import styles from './LiquidBalances.module.scss';

type Props = {
  amount: {
    liquidH: number;
    frozenH: number;
  };
};

function LiquidBalances({ amount: { liquidH, frozenH } }: Props) {
  return (
    <div className={styles.wrapper}>
      <ItemBalance
        text="Liquid"
        amount={liquidH}
        demon={CYBER.DENOM_LIQUID_TOKEN}
      />
      <ItemBalance
        text="Frozen"
        amount={frozenH}
        demon={CYBER.DENOM_LIQUID_TOKEN}
      />
    </div>
  );
}

export default LiquidBalances;
