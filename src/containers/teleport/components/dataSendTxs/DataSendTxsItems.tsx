import { Coin } from '@cosmjs/launchpad';
import { AmountDenom } from 'src/containers/txs/Activites';
import styles from './styles.module.scss';

// TO DO Check CID if memo is CID > use Ipfs for render
export function Memo({ memo, receive }: { memo: string; receive: boolean }) {
  return (
    <div
      className={styles.containerMemo}
      style={{
        textAlign: receive ? 'start' : 'end',
      }}
    >
      {memo}
    </div>
  );
}

export function AmountDenomColor({
  coins,
  receive,
}: {
  coins: Coin[];
  receive?: boolean;
}) {
  return (
    <div
      style={{
        color: receive ? '#76FF03' : '#FF5C00',
      }}
    >
      {coins.map((item, i) => {
        return (
          <AmountDenom denom={item.denom} amountValue={item.amount} key={i} />
        );
      })}
    </div>
  );
}
