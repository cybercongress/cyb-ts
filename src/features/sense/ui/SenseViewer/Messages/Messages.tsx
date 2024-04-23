import dateFormat from 'dateformat';
import { SenseItem } from 'src/features/sense/redux/sense.redux';
import MessageContainer from './Message/Message.container';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import styles from './Messages.module.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import DateTitle from './DateTitle/DateTitle';

type Props = {
  messages: SenseItem[];
  currentChatId: string;
};

const DEFAULT_ITEMS_LENGTH = 15;
const LOAD_MORE_ITEMS_LENGTH = 15;

function Messages({ messages, currentChatId }: Props) {
  const [showItemsLength, setShowItemsLength] = useState(DEFAULT_ITEMS_LENGTH);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowItemsLength(DEFAULT_ITEMS_LENGTH);
  }, [currentChatId]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.scrollTop = ref.current.scrollHeight;
  }, [ref, messages]);

  function setMore() {
    setShowItemsLength(
      (showItemsLength) => showItemsLength + LOAD_MORE_ITEMS_LENGTH
    );
  }

  const messagesByDateAll = useMemo(() => {
    return Object.entries(
      [...messages].reverse().reduce<{
        [date: string]: SenseItem[];
      }>((acc, senseItem) => {
        const date = dateFormat(senseItem.timestamp, 'yyyy-mm-dd');

        if (!acc[date]) {
          acc[date] = [];
        }

        acc[date].push(senseItem);

        return acc;
      }, {})
    );
  }, [messages]);

  const messagesByDate = useMemo(
    () => messagesByDateAll.slice(0, showItemsLength),
    [messagesByDateAll, showItemsLength]
  );

  return (
    // wrappers for correct scroll
    <div className={styles.wrapper}>
      <div className={styles.messages} ref={ref}>
        {ref.current && (
          <InfiniteScroll
            scrollableTarget={ref.current}
            inverse
            loader={null}
            scrollThreshold={0.9}
            className={styles.inner}
            dataLength={messagesByDate.length}
            hasMore={showItemsLength < messages.length}
            next={setMore}
          >
            {messagesByDate.map(([date, messages]) => {
              return (
                <Fragment key={date}>
                  {messages.map((senseItem) => (
                    <MessageContainer
                      key={senseItem.transactionHash}
                      senseItem={senseItem}
                      currentChatId={currentChatId}
                    />
                  ))}
                  <DateTitle date={new Date(date)} />
                </Fragment>
              );
            })}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}

export default Messages;
