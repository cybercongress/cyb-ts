import { useEffect, useState } from 'react';
import SenseViewer from 'src/pages/robot/Sense/SenseViewer/SenseViewer';
import SenseList from 'src/pages/robot/Sense/SenseList/SenseList';
import styles from './Sense.module.scss';
import { useAdviser } from 'src/features/adviser/context';
import { useAppSelector } from 'src/redux/hooks';
import ActionBar from './ActionBar/ActionBar';
import { SyncEntryName } from 'src/services/backend/types/services';

export type AdviserProps = {
  adviser: {
    setLoading: (isLoading: boolean) => void;
    setError: (error: string) => void;
  };
};

function Sense() {
  const [selected, setSelected] = useState<string>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const senseBackendIsLoading = useAppSelector((state) => {
    const { entryStatus } = state.backend.syncState;

    return (['transaction', 'particle'] as SyncEntryName[]).some((entry) => {
      return entryStatus[entry]?.status !== 'idle';
    });
  });

  const { setAdviser } = useAdviser();

  useEffect(() => {
    let text;
    let color;

    if (error) {
      color = 'red';
      text = error;
    } else if (loading || senseBackendIsLoading) {
      color = 'yellow';
      text = loading ? (
        'loading...'
      ) : (
        <p>
          syncing txs data... <br />
          (may take some time, but you can use Sense)
        </p>
      );
    } else {
      text = 'welcome to sense 🧬';
    }
    setAdviser(text, color);
  }, [setAdviser, loading, senseBackendIsLoading]);

  // maybe use context
  const adviserProps = {
    setLoading: (isLoading: boolean) => setLoading(isLoading),
    setError: (error: string) => setError(error),
  };

  return (
    <>
      <div className={styles.wrapper}>
        <SenseList
          select={(id: string) => setSelected(id)}
          selected={selected}
          adviser={adviserProps}
        />
        <SenseViewer selected={selected} adviser={adviserProps} />
      </div>

      <ActionBar id={selected} />
    </>
  );
}

export default Sense;
