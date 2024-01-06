import React from 'react';
import { Account } from 'src/components';
import Display from 'src/components/containerGradient/Display/Display';
import { AvataImgIpfs } from 'src/containers/portal/components/avataIpfs';
import styles from './NItem.module.scss';
import { classNames } from 'classnames';

import Pill from 'src/components/Pill/Pill';
import Date from '../../Date/Date';
import { Link } from 'react-router-dom';
import { routes } from 'src/routes';

type Props = {
  unreadCount: number;
  address: string;
  timestamp: number;
  value: string;
};

function NItem({ unreadCount, address, timestamp, value }: Props) {
  const isParticle = address?.startsWith('Qm');
  return (
    <div className={styles.wrapper}>
      {address && (
        <div className={styles.avatar}>
          <Account address={address} onlyAvatar avatar />
        </div>
      )}

      {address && (
        <h5 className={styles.title} onClickCapture={(e) => e.preventDefault()}>
          {isParticle ? '#' : '@'}

          <Account address={address} />
        </h5>
      )}
      <p className={styles.text}>{value}</p>

      <Date timestamp={timestamp} className={styles.date} />

      {unreadCount > 0 && (
        <Pill className={styles.unread} text={unreadCount}></Pill>
      )}
    </div>
  );
}

export default NItem;
