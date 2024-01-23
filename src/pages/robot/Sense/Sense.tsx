import { useEffect, useState } from 'react';
import SenseViewer from 'src/pages/robot/Sense/SenseViewer/SenseViewer';
import SenseList from 'src/pages/robot/Sense/SenseList/SenseList';
import styles from './Sense.module.scss';
import { useAdviser } from 'src/features/adviser/context';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import ActionBar from './ActionBar/ActionBar';
import { SyncEntryName } from 'src/services/backend/types/services';
import useSenseItem from './_refactor/useSenseItem';
import { useQuery } from '@tanstack/react-query';
import { useBackend } from 'src/contexts/backend';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { getSenseChat, getSenseList } from 'src/features/sense/sense.redux';
import { useDispatch } from 'react-redux';

export type AdviserProps = {
  adviser: {
    setLoading: (isLoading: boolean) => void;
    setError: (error: string) => void;
    setAdviserText: (text: string) => void;
  };
};

export const REFETCH_INTERVAL = 1000 * 20;

function Sense() {
  const [selected, setSelected] = useState<string>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [adviserText, setAdviserText] = useState('');

  // const address = useAppSelector(selectCurrentAddress);
  // const senseList = useAppSelector((store) => {
  //   return store.sense2.list;
  // });
  const { senseApi } = useBackend();

  // console.log(senseList);

  const senseById = useSenseItem({ id: selected });

  // const senseList = useQuery({
  //   queryKey: ['senseApi', 'getList', address],
  //   queryFn: async () => {
  //     return senseApi!.getList();
  //   },
  //   enabled: Boolean(senseApi && address),
  //   refetchInterval: REFETCH_INTERVAL,
  // });

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!senseApi) {
      return;
    }

    dispatch(getSenseList(senseApi));
  }, [senseApi, dispatch]);

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
    setAdviser(adviserText || text, error ? 'red' : color);
  }, [setAdviser, loading, senseBackendIsLoading, error, adviserText]);

  //  seems use context
  const adviserProps = {
    setLoading: (isLoading: boolean) => setLoading(isLoading),
    setError: (error: string) => setError(error),
    setAdviserText: (text: string) => setAdviserText(text),
  };

  useEffect(() => {
    if (!selected) {
      return;
    }

    setTimeout(() => {
      dispatch(
        getSenseChat({
          id: selected,
          senseApi,
        })
      );
    }, 300);
  }, [dispatch, selected, senseApi]);

  function update() {
    dispatch(getSenseList(senseApi));
    dispatch(
      getSenseChat({
        id: selected,
        senseApi,
      })
    );
  }

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

      <ActionBar id={selected} adviser={adviserProps} update={update} />
    </>
  );
}

export default Sense;
