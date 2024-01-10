import { useEffect, useState } from 'react';
import SenseViewer from 'src/pages/robot/Sense/SenseViewer/SenseViewer';
import SenseList from 'src/pages/robot/Sense/SenseList/SenseList';
import styles from './Sense.module.scss';
import { useAdviser } from 'src/features/adviser/context';
import { useAppSelector } from 'src/redux/hooks';
import ActionBar from './ActionBar/ActionBar';

function Sense() {
  const [selected, setSelected] = useState<string>();

  const [loading, setLoading] = useState(false);

  // const status = useAppSelector(
  //   (state) => state.backend.services.sync.status === ''
  // );

  const { setAdviser } = useAdviser();

  useEffect(() => {
    if (loading) {
      setAdviser('loading...', 'yellow');
    } else {
      setAdviser('welcome to sense');
    }
  }, [setAdviser, loading]);

  return (
    <>
      <div className={styles.wrapper}>
        <SenseList
          select={(id: string) => setSelected(id)}
          selected={selected}
          setLoading={setLoading}
        />
        <SenseViewer
          selected={selected}
          setLoading={(isLoading: boolean) => setLoading(isLoading)}
        />
      </div>

      <ActionBar id={selected} />
    </>
  );
}

export default Sense;
