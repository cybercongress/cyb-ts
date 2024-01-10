import { Account } from 'src/components';
import styles from './SenseListItem.module.scss';

import Pill from 'src/components/Pill/Pill';
import Date from '../../_refactor/Date/Date';
import cx from 'classnames';
import { cutSenseItem } from '../../utils';
import ParticleAvatar from '../../components/ParticleAvatar/ParticleAvatar';

type Props = {
  unreadCount: number;
  address: string;
  timestamp: number;
  value: string;
};

function SenseListItem({ unreadCount, address, timestamp, value }: Props) {
  const isParticle = address?.startsWith('Qm');

  return (
    <div
      className={cx(styles.wrapper, {
        [styles.particle]: isParticle,
      })}
    >
      {address && (
        <div className={styles.avatar}>
          {!isParticle ? (
            <Account address={address} onlyAvatar avatar sizeAvatar={50} />
          ) : (
            <ParticleAvatar particleId={address} />
          )}
        </div>
      )}

      {address && (
        <h5 className={styles.title} onClickCapture={(e) => e.preventDefault()}>
          {isParticle ? '#' : '@'}

          {!isParticle && <Account address={address} />}
          {isParticle && cutSenseItem(address)}
        </h5>
      )}
      <p className={styles.text}>{value}</p>

      {timestamp && <Date timestamp={timestamp} className={styles.date} />}

      {unreadCount > 0 && (
        <Pill className={styles.unread} text={unreadCount}></Pill>
      )}
    </div>
  );
}

export default SenseListItem;
