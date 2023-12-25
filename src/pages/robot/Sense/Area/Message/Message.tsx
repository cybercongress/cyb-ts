import React from 'react';
import { Account, DenomArr } from 'src/components';
import { AvataImgIpfs } from 'src/containers/portal/components/avataIpfs';
import styles from './Message.module.scss';
import dateFormat from 'dateformat';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import Denom from 'src/components/denom';
import { routes } from 'src/routes';
import { Link } from 'react-router-dom';
import Date from '../../Date/Date';
import { formatNumber } from 'src/utils/utils';

type Props = {
  address: string;
  text: string;
  type: string;
  date: string;
  amount?: MsgSend['amount'];
  txHash?: string;
};

function Message({ address, text, type, date, amount, txHash }: Props) {
  return (
    <div className={styles.wrapper}>
      <AvataImgIpfs cidAvatar={address} className={styles.avatar} />
      <h6>
        <Account address={address} />
      </h6>

      <div className={styles.date}>
        {txHash && <Link to={routes.txExplorer.getLink(txHash)}>✔</Link>}
        <Date timestamp={date} />
      </div>

      <p className={styles.content}>{text}</p>

      <div className={styles.amount}>
        {amount?.map(({ amount, denom }, i) => {
          return (
            <div key={i}>
              <span>{formatNumber(amount)}</span>
              <DenomArr denomValue={denom} onlyImg />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Message;
