import React from 'react';
import { Account } from 'src/components';
import Display from 'src/components/containerGradient/Display/Display';
import { AvataImgIpfs } from 'src/containers/portal/components/avataIpfs';
import styles from './NItem.module.scss';
import { classNames } from 'classnames';

import Pill from 'src/components/Pill/Pill';
import Date from '../../Date/Date';

type Props = {
  unreadCount: number;
  address: string;
  timestamp: number;
  value: string;
};

function NItem({ unreadCount, address, timestamp, value }: Props) {
  return (
    <div className={styles.wrapper}>
      <AvataImgIpfs className={styles.avatar} addressCyber={address} />

      {address && (
        <h5 className={styles.title} onClickCapture={(e) => e.preventDefault()}>
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
