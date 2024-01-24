import { Account, AmountDenom, Tooltip } from 'src/components';
import styles from './Message.module.scss';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import { routes } from 'src/routes';
import { Link } from 'react-router-dom';
import Date from '../../components/Date/Date';
import cx from 'classnames';
import { useMemo } from 'react';
import { SenseItem } from 'src/features/sense/redux/sense.redux';

type Props = {
  address: string;
  text: string;
  date: number;
  amountData?: {
    amount: MsgSend['amount'] | undefined;
    isAmountSend: boolean;
  };
  txHash?: string;
  // fix
  status: SenseItem['status'];
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

function Message({ address, text, date, amountData, txHash, status }: Props) {
  // const myAddress = useAppSelector(selectCurrentAddress);
  // const myMessage = address === myAddress;

  const statusText = useMemo(() => {
    switch (status) {
      case 'pending':
        return '⏳';

      case 'error':
        return '❌';

      default:
        return '✔';
    }
  }, [status]);

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
          <Tooltip
            tooltip={(() => {
              if (status === 'pending') {
                return 'Tx pending - view';
              }
              if (status === 'error') {
                return 'Tx error - view';
              }
              return 'View tx';
            })()}
          >
            <Link
              className={cx(styles.tx, {
                [styles[`status_${status}`]]: status,
              })}
              target="_blank"
              to={routes.txExplorer.getLink(txHash)}
            >
              {statusText}
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
