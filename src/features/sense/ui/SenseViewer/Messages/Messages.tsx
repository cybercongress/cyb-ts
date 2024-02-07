import dateFormat from 'dateformat';
import { SenseItem } from 'src/features/sense/redux/sense.redux';
import MessageContainer from './Message/Message.container';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import styles from './Messages.module.scss';
import InfiniteScroll from 'react-infinite-scroll-component';

type Props = {
  messages: SenseItem[];
};

const DEFAULT_ITEMS_LENGTH = 15;
const LOAD_MORE_ITEMS_LENGTH = 15;

function Messages({ messages }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [showItemsLength, setShowItemsLength] = useState(DEFAULT_ITEMS_LENGTH);

  //   useEffect(() => {
  //     setShowItemsLength(DEFAULT_ITEMS_LENGTH);
  //   }, [selected]);

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

  const renderedMessages = useMemo(() => {
    return [...messages].reverse().slice(0, showItemsLength);
  }, [messages, showItemsLength]);

  // think better refactor to combine messages by dates
  const dates: string[] = [];

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
            dataLength={renderedMessages.length}
            hasMore={showItemsLength < messages.length}
            next={setMore}
          >
            {renderedMessages.map((senseItem, i, messages) => {
              const date = dateFormat(senseItem.timestamp, 'dd-mm-yyyy');

              // refactor this bullshit
              const lastItem = dates[dates.length - 1];

              let render;
              if (lastItem && date !== lastItem) {
                let parts = lastItem.split('-');
                let day = parseInt(parts[0], 10);
                let month = parseInt(parts[1], 10) - 1;
                let year = parseInt(parts[2], 10);

                let date = new Date(year, month, day);

                render = date;
              }

              const noDate = !dates.includes(date);
              if (noDate) {
                dates.push(date);
              }

              const isLastMessage = i === messages.length - 1;

              if (isLastMessage) {
                render = new Date(senseItem.timestamp);
              }

              return (
                <Fragment key={i}>
                  {render && !isLastMessage && (
                    <p className={styles.date}>
                      {dateFormat(render, 'mmmm dd')}
                    </p>
                  )}
                  <MessageContainer key={i} senseItem={senseItem} />
                  {isLastMessage && (
                    <p className={styles.date}>
                      {dateFormat(render, 'mmmm dd')}
                    </p>
                  )}
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
