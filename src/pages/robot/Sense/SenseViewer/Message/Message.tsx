import React from 'react';
import { Account, DenomArr, Tooltip } from 'src/components';
import { AvataImgIpfs } from 'src/containers/portal/components/avataIpfs';
import styles from './Message.module.scss';
import dateFormat from 'dateformat';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import Denom from 'src/components/denom';
import { routes } from 'src/routes';
import { Link } from 'react-router-dom';
import Date from '../../_refactor/Date/Date';
import { formatNumber } from 'src/utils/utils';

type Props = {
  address: string;
  text: string;
  type: string;
  date: string;
  amount?: MsgSend['amount'];
  txHash?: string;
};

export function CoinAmount({
  amount,
  denom,
}: {
  amount: string;
  denom: string;
}) {
  return (
    <div className={styles.coinAmount}>
      <span>{formatNumber(amount)}</span>
      <DenomArr denomValue={denom} onlyImg />
    </div>
  );
}

function Message({ address, text, type, date, amount, txHash }: Props) {
  return (
    <div className={styles.wrapper}>
      {/* <AvataImgIpfs cidAvatar={address}  /> */}
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
        {amount?.map(({ amount, denom }, i) => {
          return <CoinAmount key={i} amount={amount} denom={denom} />;
        })}
      </div>
    </div>
  );
}

export default Message;
