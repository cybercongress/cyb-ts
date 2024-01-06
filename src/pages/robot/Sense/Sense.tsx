import React, { useEffect, useState } from 'react';
import Area from 'src/pages/robot/Sense/Area/Area';
import NotificationList from 'src/pages/robot/Sense/NotificationList/NotificationList';
import styles from './Sense.module.scss';
import Loading from '../../../components/ui/Loading';
import { useAdviser } from 'src/features/adviser/context';
import { useAppSelector } from 'src/redux/hooks';

function Sense() {
  const [selected, setSelected] = useState<string>();

  const [loading, setLoading] = useState(false);

  const status = useAppSelector(
    (state) => state.backend.services.sync.status === ''
  );

  const { setAdviser } = useAdviser();

  useEffect(() => {
    if (loading) {
      setAdviser('loading...', 'yellow');
    } else {
      setAdviser('welcome to sense');
    }
  }, [setAdviser, loading]);

  return (
    <div className={styles.wrapper}>
      <NotificationList
        select={(id: string) => setSelected(id)}
        selected={selected}
        setLoading={setLoading}
      />
      <Area selected={selected} setLoading={setLoading} />
    </div>
  );
}

export default Sense;
