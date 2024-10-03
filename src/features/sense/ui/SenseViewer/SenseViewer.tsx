import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { useBackend } from 'src/contexts/backend/backend';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { useEffect } from 'react';
import Loader2 from 'src/components/ui/Loader2';

import { markAsRead, LLMMessage } from 'src/features/sense/redux/sense.redux';

import { useRobotContext } from 'src/pages/robot/robot.context';
import Messages from './Messages/Messages';
import { AdviserProps } from '../Sense';
import styles from './SenseViewer.module.scss';
import SenseViewerHeader from './SenseViewerHeader/SenseViewerHeader';

type Props = {
  selected: string | undefined;
  isLLMFilter: boolean;
} & AdviserProps;

function SenseViewer({ adviser, selected, isLLMFilter }: Props) {
  const { senseApi } = useBackend();
  const { isOwner } = useRobotContext();

  const chat = useAppSelector((state) => {
    return selected && state.sense.chats[selected];
  });

  const dispatch = useAppDispatch();

  const { error, isLoading: loading, data: messages } = chat || {};

  useEffect(() => {
    if (selected && senseApi && !isLLMFilter) {
      dispatch(
        markAsRead({
          id: selected,
          senseApi,
        })
      );
    }
  }, [selected, senseApi, dispatch, isLLMFilter]);

  useEffect(() => {
    adviser.setLoading(!!loading); // **Ensured boolean value**
  }, [loading, adviser]);

  useEffect(() => {
    adviser.setError(error || '');
  }, [error, adviser]);

  const llmThreads = useAppSelector((state) => state.sense.llm.threads);
  const currentThreadId = useAppSelector((state) => state.sense.llm.currentThreadId);

  let llmMessages: LLMMessage[] = [];
  if (isLLMFilter && currentThreadId) {
    const currentThread = llmThreads.find((thread) => thread.id === currentThreadId);
    if (currentThread) {
      llmMessages = currentThread.messages;
    }
  }

  let title;

  if (selected && !isLLMFilter) {
    title = <DisplayTitle title={<SenseViewerHeader selected={selected} />} />;
  }

  if (selected && !isOwner && !isLLMFilter) {
    title = undefined;
  }

  return (
    <div className={styles.wrapper}>
      <Display title={title} noPadding>
        {isLLMFilter && currentThreadId ? (
          <Messages messages={llmMessages} currentChatId="llm" />
        ) : selected && !!messages?.length ? (
          <Messages messages={messages} currentChatId={selected} />
        ) : loading ? (
          <div className={styles.noData}>
            <Loader2 />
          </div>
        ) : (
          <p className={styles.noData}>Select chat to start messaging</p>
        )}
      </Display>
    </div>
  );
}

export default SenseViewer;