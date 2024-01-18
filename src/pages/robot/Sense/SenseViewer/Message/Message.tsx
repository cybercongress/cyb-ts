import { Account, AmountDenom, Tooltip } from 'src/components';
import styles from './Message.module.scss';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import { routes } from 'src/routes';
import { Link } from 'react-router-dom';
import Date from '../../_refactor/Date/Date';
import cx from 'classnames';

type Props = {
  address: string;
  text: string;
  date: number;
  amountData?: {
    amount: MsgSend['amount'] | undefined;
    isAmountSend: boolean;
  };
  txHash?: string;
};

export enum CoinAction {
  send = 'send',
  receive = 'receive',
}

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

function Message({ address, text, date, amountData, txHash }: Props) {
  // const myAddress = useAppSelector(selectCurrentAddress);
  // const myMessage = address === myAddress;

  return (
    <div
      className={cx(styles.wrapper, {
        // [styles.myMessage]: myMessage,
      })}
    >
      <div className={styles.avatar}>
        <Account address={address} onlyAvatar avatar sizeAvatar={40} />
      </div>
      <h6>
        <Account address={address} />
      </h6>

      <div className={styles.timestampBlock}>
        {txHash && (
          <Tooltip tooltip="View tx">
            <Link
              className={styles.tx}
              target="_blank"
              to={routes.txExplorer.getLink(txHash)}
            >
              ✔
            </Link>
          </Tooltip>
        )}
        <Date timestamp={+date} />
      </div>

      <p className={styles.content}>{text}</p>

      <div className={styles.amount}>
        {amountData?.amount?.map(({ amount, denom }, i) => {
          return (
            <CoinAmount
              key={i}
              amount={amount}
              denom={denom}
              type={
                amountData.isAmountSend ? CoinAction.send : CoinAction.receive
              }
            />
          );
        })}
      </div>
    </div>
  );
}

export default Message;
