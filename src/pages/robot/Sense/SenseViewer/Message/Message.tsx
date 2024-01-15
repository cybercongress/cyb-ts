import React from 'react';
import { Account, AmountDenom, DenomArr, Tooltip } from 'src/components';
import { AvataImgIpfs } from 'src/containers/portal/components/avataIpfs';
import styles from './Message.module.scss';
import dateFormat from 'dateformat';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import Denom from 'src/components/denom';
import { routes } from 'src/routes';
import { Link } from 'react-router-dom';
import Date from '../../_refactor/Date/Date';
import { formatNumber } from 'src/utils/utils';
import cx from 'classnames';
import useGetCreator from 'src/containers/ipfs/hooks/useGetCreator';

type Props = {
  address: string;
  text: string;
  // type: string;
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
  // const isP = address && address.startsWith('Qm');

  // const creator = useGetCreator();

  return (
    <div className={styles.wrapper}>
      <div className={styles.avatar}>
        <Account address={address} onlyAvatar avatar sizeAvatar={40} />
      </div>
      <h6>
        <Account address={address} />
      </h6>

      <div className={styles.timestampBlock}>
        {txHash && (
          <Tooltip tooltip="View tx">
            <Link className={styles.tx} to={routes.txExplorer.getLink(txHash)}>
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
