import { useEffect, useState } from 'react';
import SenseViewer from 'src/features/sense/ui/SenseViewer/SenseViewer';
import SenseList from 'src/features/sense/ui/SenseList/SenseList';
import styles from './Sense.module.scss';
import { useAdviser } from 'src/features/adviser/context';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import ActionBar from './ActionBar/ActionBar';
import { useBackend } from 'src/contexts/backend/backend';
import { getSenseChat } from 'src/features/sense/redux/sense.redux';
import { useNavigate, useParams } from 'react-router-dom';
import { convertTimestampToString } from 'src/utils/date';

export type AdviserProps = {
  adviser: {
    setLoading: (isLoading: boolean) => void;
    setError: (error: string) => void;
    setAdviserText: (text: string) => void;
  };
};

function Sense({ urlSenseId }: { urlSenseId?: string }) {
  const { senseId: paramSenseId } = useParams<{
    senseId: string;
  }>();

  const navigate = useNavigate();

  const [selected, setSelected] = useState<string | undefined | null>(
    urlSenseId
  );

  // update state asap
  if (urlSenseId !== selected) {
    setSelected(urlSenseId);
  }

  const dispatch = useAppDispatch();
  const { senseApi } = useBackend();

  // maybe move to another component
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [adviserText, setAdviserText] = useState('');

  useEffect(() => {
    if (!selected || !senseApi) {
      return;
    }

    dispatch(
      getSenseChat({
        id: selected,
        senseApi,
      })
    );
  }, [dispatch, selected, senseApi]);

  const syncState = useAppSelector((state) => state.backend.syncState);

  const { setAdviser } = useAdviser();

  useEffect(() => {
    let text;
    let color;

    if (error) {
      color = 'red';
      text = error;
    } else if (loading || syncState.inProgress) {
      color = 'yellow';
      text = loading ? (
        'loading...'
      ) : (
        <p>
          syncing txs data <br />
          {!syncState.initialSyncDone && syncState.inProgress
            ? `${syncState.message} (remaining: ${
                syncState.totalEstimatedTime > -1
                  ? convertTimestampToString(syncState.totalEstimatedTime)
                  : '???'
              })...`
            : ''}
        </p>
      );
    } else {
      text = 'welcome to sense 🧬';
    }
    setAdviser(adviserText || text, error ? 'red' : color);
  }, [setAdviser, loading, error, adviserText, syncState]);

  //  seems use context
  const adviserProps = {
    setLoading: (isLoading: boolean) => setLoading(isLoading),
    setError: (error: string) => setError(error),
    setAdviserText: (text: string) => setAdviserText(text),
  };

  function update() {
    // dispatch(getSenseList(senseApi));
    // dispatch(
    //   getSenseChat({
    //     id: selected,
    //     senseApi,
    //   })
    // );
  }

  return (
    <>
      <div className={styles.wrapper}>
        <SenseList
          select={(id: string) => {
            setSelected(id);

            if (!paramSenseId) {
              navigate(`./${id}`);
            } else {
              navigate(`../${id}`, {
                relative: 'path',
              });
            }
          }}
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
