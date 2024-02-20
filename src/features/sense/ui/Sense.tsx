import { useEffect, useState } from 'react';
import SenseViewer from 'src/features/sense/ui/SenseViewer/SenseViewer';
import SenseList from 'src/features/sense/ui/SenseList/SenseList';
import styles from './Sense.module.scss';
import { useAdviser } from 'src/features/adviser/context';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import ActionBar from './ActionBar/ActionBar';
import { SyncEntryName } from 'src/services/backend/types/services';
import { useBackend } from 'src/contexts/backend/backend';
import { getSenseChat } from 'src/features/sense/redux/sense.redux';
import { useNavigate, useParams } from 'react-router-dom';
import { convertTimestampToString } from 'src/utils/date';
import usePassportByAddress from 'src/features/passport/hooks/usePassportByAddress';
import { isParticle } from 'src/features/particle/utils';
import usePassportContract from 'src/features/passport/usePassportContract';
import { Citizenship } from 'src/types/citizenship';

export type AdviserProps = {
  adviser: {
    setLoading: (isLoading: boolean) => void;
    setError: (error: string) => void;
    setAdviserText: (text: string) => void;
  };
};

function SenseWrapper() {
  const { senseId: paramSenseId } = useParams<{
    senseId: string;
  }>();

  console.log('paramSenseId', paramSenseId);

  const nickname = paramSenseId?.includes('@')
    ? paramSenseId.replace('@', '')
    : undefined;

  const { data: urlPassport } = usePassportContract<Citizenship | null>({
    query: {
      passport_by_nickname: {
        nickname: nickname!,
      },
    },
    skip: !nickname,
  });

  let senseId;

  if (nickname) {
    if (urlPassport && urlPassport.extension.nickname === nickname) {
      senseId = urlPassport.owner;
    }
  } else if (paramSenseId) {
    senseId = paramSenseId;
  }

  // eslint-disable-next-line no-use-before-define
  return <Sense urlSenseId={senseId} />;
}

function Sense({ urlSenseId }: { urlSenseId?: string }) {
  const { senseId: paramSenseId } = useParams<{
    senseId: string;
  }>();

  console.log('urlSenseId', urlSenseId);

  const [selected, setSelected] = useState<string | undefined | null>(
    urlSenseId
  );

  console.log('selected', selected);

  // update state asap
  if (urlSenseId !== selected) {
    setSelected(urlSenseId);
  }

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { senseApi } = useBackend();

  // maybe move to another component
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [adviserText, setAdviserText] = useState('');

  const { data: activeChatPassport } = usePassportByAddress(selected, {
    skip: Boolean(selected && isParticle(selected)),
  });

  useEffect(() => {
    if (!activeChatPassport) {
      return;
    }

    const {
      owner,
      extension: { nickname },
    } = activeChatPassport;

    if (owner === paramSenseId) {
      debugger;

      navigate(`../@${nickname}`, {
        relative: 'path',
        replace: true,
      });
    }
  }, [activeChatPassport, navigate, paramSenseId]);

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

  const senseBackendIsLoading = useAppSelector((state) => {
    const { entryStatus } = state.backend.syncState;

    return (['transaction', 'particle'] as SyncEntryName[]).some((entry) => {
      return !['idle', 'listen'].some(
        (status) => entryStatus[entry]?.status === status
      );
    });
  });

  const syncState = useAppSelector((state) => state.backend.syncState);

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
          syncing txs data <br />
          {syncState.inProgress
            ? `${syncState.message} (remaining: ${
                syncState.totalEstimatedTime > -1
                  ? convertTimestampToString(syncState.totalEstimatedTime)
                  : '???'
              })...`
            : syncState.status === 'started'
            ? 'estimating time to complete...'
            : ''}
        </p>
      );
    } else {
      text = 'welcome to sense 🧬';
    }
    setAdviser(adviserText || text, error ? 'red' : color);
  }, [
    setAdviser,
    loading,
    senseBackendIsLoading,
    error,
    adviserText,
    syncState,
  ]);

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

export default SenseWrapper;
