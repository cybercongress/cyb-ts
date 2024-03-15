import { Account, Tooltip } from 'src/components';
import styles from './SenseListItem.module.scss';

import Pill from 'src/components/Pill/Pill';
import Date from '../../components/Date/Date';
import cx from 'classnames';
import { cutSenseItem, isBostromAddress } from '../../utils';
import ParticleAvatar from '../../components/ParticleAvatar/ParticleAvatar';
import { isParticle as isParticleFunc } from 'src/features/particle/utils';
import { SenseItem } from 'src/features/sense/redux/sense.redux';
import { getStatusText } from '../../utils/getStatusText';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import CoinsAmount, {
  CoinAction,
} from '../../components/CoinAmount/CoinAmount';

type Props = {
  address: string;
  date: string;
  content: string | JSX.Element;
  unreadCount: number;

  amountData?: {
    amount: MsgSend['amount'] | undefined;
    isAmountSendToMyAddress?: boolean;
  };

  status?: SenseItem['status'] | undefined;
  fromLog?: boolean;

  // maybe temp
  title?: string;
};

function SenseListItem({
  unreadCount,
  address,
  date,
  content,
  status,
  amountData,
  from,
  fromLog,
  title,
}: Props) {
  const isParticle = address && isParticleFunc(address);

  let icon;
  let statusText;

  if (status === 'pending') {
    icon = '⏳';
    statusText = 'tx pending';
  } else if (status === 'error') {
    icon = '❗️';
    // TODO: add error message
    statusText = 'error';
  } else if (fromLog) {
    icon = '☘️';
    statusText = 'message from log';
  }

  const withAmount = Boolean(amountData?.amount?.length);

  return (
    <div
      className={cx(styles.wrapper, {
        [styles.particle]: isParticle,
      })}
    >
      <div className={styles.avatar}>
        {!isParticle ? (
          <Account address={address} onlyAvatar avatar sizeAvatar={50} />
        ) : (
          <ParticleAvatar particleId={address} />
        )}

        {icon && (
          <Tooltip tooltip={statusText!}>
            <span className={styles.icon}>{icon}</span>
          </Tooltip>
        )}

        {address !== from && (
          <div className={styles.icon}>
            <Account address={from} onlyAvatar avatar sizeAvatar={20} />
          </div>
        )}
      </div>

      <h5
        className={cx(styles.title, {
          [styles.particleTitle]: isParticle,
          [styles.uppercase]: !title,
        })}
        onClickCapture={(e) => e.preventDefault()}
      >
        {!isParticle ? (
          <>
            @<Account address={address} />
          </>
        ) : (
          <>{title || `#${cutSenseItem(address)}`}</>
        )}
      </h5>

      <div
        className={cx(styles.content, {
          [styles.withAmount]: withAmount,
        })}
      >
        <p>{content}</p>

        {withAmount && (
          <div className={styles.amounts}>
            <CoinsAmount
              amount={amountData!.amount!.slice(0, 1)}
              type={
                amountData!.isAmountSendToMyAddress === false
                  ? CoinAction.send
                  : CoinAction.receive
              }
            />
          </div>
        )}
      </div>

      {date && <Date timestamp={date} className={styles.date} />}

      {unreadCount > 0 && (
        <Pill
          className={styles.unread}
          text={unreadCount > 99 ? '99+' : unreadCount.toString()}
        />
      )}
    </div>
  );
}

export default SenseListItem;
