import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { useBackend } from 'src/contexts/backend/backend';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { useEffect } from 'react';
import Loader2 from 'src/components/ui/Loader2';

import { markAsRead } from 'src/features/sense/redux/sense.redux';

import { useRobotContext } from 'src/pages/robot/robot.context';
import Messages from './Messages/Messages';
import { AdviserProps } from '../Sense';
import styles from './SenseViewer.module.scss';
import SenseViewerHeader from './SenseViewerHeader/SenseViewerHeader';

type Props = {
  selected: string | undefined;
} & AdviserProps;

function SenseViewer({ adviser, selected }: Props) {
  const { senseApi } = useBackend();
  const { isOwner } = useRobotContext();

  const chat = useAppSelector((store) => {
    return selected && store.sense.chats[selected];
  });

  const dispatch = useAppDispatch();

  const { error, isLoading: loading, data: messages } = chat || {};

  useEffect(() => {
    if (selected && senseApi) {
      dispatch(
        markAsRead({
          id: selected,
          senseApi,
        })
      );
    }
  }, [selected, senseApi, dispatch]);

  useEffect(() => {
    adviser.setLoading(loading);
  }, [loading, adviser]);

  useEffect(() => {
    adviser.setError(error || '');
  }, [error, adviser]);

  let title;

  if (selected) {
    title = <DisplayTitle title={<SenseViewerHeader selected={selected} />} />;
  }

  if (selected && !isOwner) {
    title = undefined;
  }

  return (
    <div className={styles.wrapper}>
      <Display title={title} noPadding>
        {selected && !!messages?.length ? (
          <Messages messages={messages} currentChatId={selected} />
        ) : loading ? (
          <div className={styles.noData}>
            <Loader2 />
          </div>
        ) : (
          <p className={styles.noData}>select chat to start messaging</p>
        )}
      </Display>
    </div>
  );
}

export default SenseViewer;
