import { Account, Tooltip } from 'src/components';
import styles from './SenseListItem.module.scss';

import Pill from 'src/components/Pill/Pill';
import Date from '../../components/Date/Date';
import cx from 'classnames';
import { cutSenseItem } from '../../utils';
import ParticleAvatar from '../../components/ParticleAvatar/ParticleAvatar';
import { isParticle as isParticleFunc } from 'src/features/particle/utils';
import useParticleDetails from '../../../../particle/useParticleDetails';
import { contentTypeConfig } from 'src/containers/Search/Filters/Filters';
import { SenseItem } from 'src/features/sense/redux/sense.redux';

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
      <p
        className={cx(styles.text, {
          [styles.withAmount]: withAmount,
        })}
      >
        {value}
      </p>

      {timestamp && <Date timestamp={timestamp} className={styles.date} />}

      {unreadCount > 0 && (
        <Pill
          className={styles.unread}
          text={unreadCount > 99 ? '99+' : unreadCount.toString()}
        />
      )}
      {status &&
        (() => {
          switch (status) {
            case 'pending':
              return '⏳';

            case 'error':
              return '❌';

            default:
              return null;
          }
        })()}
    </div>
  );
}

export default SenseListItem;
