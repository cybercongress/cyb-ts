import dateFormat from 'dateformat';
import { SenseItem } from 'src/features/sense/redux/sense.redux';
import MessageContainer from '../Message/Message.container';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import styles from './Messages.module.scss';
import InfiniteScroll from 'react-infinite-scroll-component';

type Props = {
  messages: SenseItem[];
};

const DEFAULT_ITEMS_LENGTH = 15;
const LOAD_MORE_ITEMS_LENGTH = 10;

function Messages({ messages }: Props) {
  const ref = useRef<HTMLDivElement>();
  const [showItemsLength, setShowItemsLength] = useState(DEFAULT_ITEMS_LENGTH);

  //   useEffect(() => {
  //     setShowItemsLength(DEFAULT_ITEMS_LENGTH);
  //   }, [selected]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.scrollTop = ref.current.scrollHeight + 100;
  }, [ref, messages]);

  function setMore() {
    setShowItemsLength(
      (showItemsLength) => showItemsLength + LOAD_MORE_ITEMS_LENGTH
    );
  }

  const renderedMessages = useMemo(() => {
    return messages.slice(0, showItemsLength).reverse();
  }, [messages, showItemsLength]);

  const dates: string[] = [];

  // console.log(messages);
  // console.log(renderedMessages);

  return (
    <div className={styles.messages} ref={ref} id="scrollableDiv">
      <InfiniteScroll
        // scrollableTarget={ref.current}
        scrollableTarget="scrollableDiv"
        inverse
        loader={null}
        scrollThreshold={0.9}
        style={{ display: 'flex', flexDirection: 'column-reverse' }}
        dataLength={renderedMessages.length}
        hasMore={showItemsLength < messages.length}
        next={setMore}
      >
        {renderedMessages.map((senseItem, i, messages) => {
          const date = dateFormat(senseItem.timestamp, 'dd-mm-yyyy');

          const noDate = !dates.includes(date);
          if (noDate) {
            dates.push(date);
          }

          const isLastMessage = i === messages.length - 1;

          return (
            <Fragment key={i}>
              <MessageContainer key={i} senseItem={senseItem} />
              {(noDate || isLastMessage) && (
                <p className={styles.date}>
                  {dateFormat(senseItem.timestamp, 'mmmm dd')}
                </p>
              )}
            </Fragment>
          );
        })}
      </InfiniteScroll>
    </div>
  );
}

export default Messages;
