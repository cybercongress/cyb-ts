import { Account } from 'src/components';
import styles from './SenseListItem.module.scss';

import Pill from 'src/components/Pill/Pill';
import Date from '../../components/Date/Date';
import cx from 'classnames';
import { cutSenseItem } from '../../utils';
import ParticleAvatar from '../../components/ParticleAvatar/ParticleAvatar';
import { isParticle as isParticleFunc } from 'src/features/particle/utils';
import { SenseItem } from 'src/features/sense/redux/sense.redux';
import { getStatusText } from '../../utils/getStatusText';

type Props = {
  unreadCount: number;
  address: string;
  timestamp: number;
  value: string | Element;

  // temp
  withAmount?: boolean;
  status?: SenseItem['status'];
};

function SenseListItem({
  unreadCount,
  address,
  timestamp,
  value,
  status,
  withAmount,
}: Props) {
  const isParticle = address && isParticleFunc(address);

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
      </div>

      <h5 className={styles.title} onClickCapture={(e) => e.preventDefault()}>
        {!isParticle ? (
          <>
            @<Account address={address} />
          </>
        ) : (
          <>#{cutSenseItem(address)}</>
        )}
      </h5>

      <div
        className={cx(styles.text, {
          [styles.withAmount]: withAmount,
        })}
      >
        {value}
      </div>

      {timestamp && <Date timestamp={timestamp} className={styles.date} />}

      {unreadCount > 0 && (
        <Pill
          className={styles.unread}
          text={unreadCount > 99 ? '99+' : unreadCount.toString()}
        />
      )}
      {status && getStatusText(status)}
    </div>
  );
}

export default SenseListItem;
