import { AmountDenom } from 'src/components';
import { Coin } from '@cosmjs/launchpad';
import styles from './CoinAmount.module.scss';
import cx from 'classnames';

export enum CoinAction {
  send = 'send',
  receive = 'receive',
}

// eslint-disable-next-line import/no-unused-modules
export function CoinAmount({
  amount,
  denom,
  type = CoinAction.receive,
}: {
  amount: string;
  denom: string;
  type?: CoinAction;
}) {
  return (
    <div
      className={cx(styles.coinAmount, {
        [styles.send]: type === CoinAction.send,
      })}
    >
      <AmountDenom
        amountValue={amount}
        denom={denom}
        styleValue={{
          flexDirection: 'unset',
        }}
      />
    </div>
  );
}

type Props = {
  amount: Coin[];
  type?: CoinAction;
};

export default function CoinsAmount({ amount, type }: Props) {
  return (
    <>
      {amount.map(({ amount, denom }, i) => {
        // if (denom === 'boot' && amount === '1') {
        //   return null;
        // }

        return <CoinAmount key={i} amount={amount} denom={denom} type={type} />;
      })}
    </>
  );
}
