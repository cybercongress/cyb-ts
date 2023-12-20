import React, { useState } from 'react';
import Area from 'src/features/notifications/Area/Area';
import NotificationList from 'src/features/notifications/NotificationList/NotificationList';
import styles from './Sense.module.scss';

function Sense() {
  const [selected, setSelected] = useState<string>();
  return (
    <div className={styles.wrapper}>
      <NotificationList
        select={(id: string) => setSelected(id)}
        selected={selected}
      />
      <Area selected={selected} />
    </div>
  );
}

export default Sense;
