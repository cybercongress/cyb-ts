import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import styles from './SenseViewer.module.scss';
import { useBackend } from 'src/contexts/backend';
import { Account } from 'src/components';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { routes } from 'src/routes';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Loader2 from 'src/components/ui/Loader2';
import { cutSenseItem } from '../utils';
import ParticleAvatar from '../components/ParticleAvatar/ParticleAvatar';
import useParticleDetails from '../_refactor/useParticleDetails';
import { isParticle as isParticleFunc } from 'src/features/particles/utils';
import { AdviserProps } from '../Sense';
import MessageContainer from './Message/Message.container';
import { markAsRead } from 'src/features/sense/redux/sense.redux';

type Props = {
  selected: string | undefined;
} & AdviserProps;

const DEFAULT_ITEMS_LENGTH = 20;
const LOAD_MORE_ITEMS_LENGTH = 20;

function SenseViewer({ selected, adviser }: Props) {
  const { senseApi } = useBackend();

  const [showItemsLength, setShowItemsLength] = useState(DEFAULT_ITEMS_LENGTH);

  const isParticle = isParticleFunc(selected || '');

  const chat = useAppSelector((store) => {
    return selected && store.sense.chats[selected];
  });

  const { data: particleData } = useParticleDetails(selected!, {
    skip: !isParticle && !selected,
  });

  const dispatch = useAppDispatch();

  const { error, isLoading: loading, data } = chat || {};

  const text = particleData?.text;

  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.scrollTop = ref.current.scrollHeight + 100;
  }, [ref, data]);

  useEffect(() => {
    selected &&
      dispatch(
        markAsRead({
          id: selected,
          senseApi,
        })
      );
  }, [selected, senseApi, dispatch]);

  useEffect(() => {
    setShowItemsLength(DEFAULT_ITEMS_LENGTH);
  }, [selected]);

  function setMore() {
    setShowItemsLength(
      (showItemsLength) => showItemsLength + LOAD_MORE_ITEMS_LENGTH
    );
  }

  useEffect(() => {
    adviser.setLoading(loading);
  }, [loading, adviser]);

  useEffect(() => {
    adviser.setError(error || '');
  }, [error, adviser]);

  // useMemo
  const items = [...(data || [])].slice(0, 100);

  console.log(loading, 'loading');
  console.log(data);
  console.log(showItemsLength);
  console.log('items', items);

  return (
    <div className={styles.wrapper}>
      <Display
        title={
          selected && (
            <DisplayTitle
              title={
                isParticle ? (
                  <header className={styles.header}>
                    <ParticleAvatar particleId={selected} />
                    <Link
                      className={styles.title}
                      to={routes.oracle.ask.getLink(selected)}
                    >
                      {cutSenseItem(selected)}
                    </Link>
                    {text && <p>{text}</p>}
                  </header>
                ) : (
                  <Account address={selected} avatar />
                )
              }
            />
          )
        }
      >
        {selected && items ? (
          <div className={styles.messages} ref={ref}>
            {/* <InfiniteScroll
              inverse
              loader={<h4>Loading...</h4>}
              dataLength={items.length}
              next={setMore}
              hasMore={data && data.length > showItemsLength}
            > */}
            {items.map((senseItem, i) => {
              return (
                <MessageContainer
                  key={i}
                  senseItem={senseItem}
                  isParticle={isParticle}
                />
              );
            })}
            {/* </InfiniteScroll> */}
          </div>
        ) : loading ? (
          <div className={styles.noData}>
            <Loader2 />
          </div>
        ) : (
          <p className={styles.noData}>
            post to your log, <br />
            or select chat to start messaging
          </p>
        )}
      </Display>
    </div>
  );
}

export default SenseViewer;
