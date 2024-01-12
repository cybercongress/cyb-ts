import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import styles from './SenseViewer.module.scss';
import { useBackend } from 'src/contexts/backend';
import { Account } from 'src/components';
import { useQuery } from '@tanstack/react-query';
import Message from './Message/Message';
import { MsgMultiSend, MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import { SupportedTypes } from '../types';
import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import useSenseItem from '../_refactor/useSenseItem';
import { routes } from 'src/routes';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Loader2 from 'src/components/ui/Loader2';
import { cutSenseItem } from '../utils';
import ParticleAvatar from '../components/ParticleAvatar/ParticleAvatar';
import useParticleDetails from '../_refactor/useParticleDetails';
import { isParticle as isParticleFunc } from 'src/features/particles/utils';
import {
  EntryType,
  LinkDbEntity,
  TransactionDbEntity,
} from 'src/services/CozoDb/types/entities';
import InfiniteScroll from 'react-infinite-scroll-component';
import { log } from 'tone/build/esm/core/util/Debug';
import {
  CyberLinkTransaction,
  MsgMultiSendTransaction,
  MsgSendTransaction,
} from 'src/services/backend/services/dataSource/blockchain/types';
import { AdviserProps } from '../Sense';

type Props = {
  selected: string | undefined;
} & AdviserProps;

const DEFAULT_ITEMS_LENGTH = 20;
const LOAD_MORE_ITEMS_LENGTH = 20;

function SenseViewer({ selected, adviser }: Props) {
  const { senseApi } = useBackend();

  const [showItemsLength, setShowItemsLength] = useState(DEFAULT_ITEMS_LENGTH);

  const address = useAppSelector(selectCurrentAddress);

  const isParticle = isParticleFunc(selected || '');

  const { data: particleData } = useParticleDetails(selected!, {
    skip: !isParticle && !selected,
  });

  const { data, loading, error } = useSenseItem({ id: selected });

  const text = particleData?.text;

  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.scrollTop = ref.current.scrollHeight + 100;
  }, [ref, data]);

  useEffect(() => {
    selected && senseApi?.markAsRead(selected);
  }, [selected, senseApi]);

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

  console.log(loading, 'loading');

  useEffect(() => {
    adviser.setError(error?.message || '');
  }, [error, adviser]);

  // useMemo
  const items = [...(data || [])].reverse();

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
              const { timestamp, hash } = senseItem;

              let text;
              let from;
              let amount: Coin[] | undefined;
              let isAmountSend = false;

              if (isParticle) {
                const item = senseItem as LinkDbEntity;

                from = item.from;
                text = item.text;
              } else {
                const item = senseItem as TransactionDbEntity;
                const { type, value, memo } = item;

                switch (type) {
                  case 'cosmos.bank.v1beta1.MsgSend': {
                    const v = value as MsgSendTransaction['value'];

                    from = v.from_address;
                    amount = v.amount;
                    text = memo;
                    isAmountSend = v.from_address === address;

                    break;
                  }

                  case 'cosmos.bank.v1beta1.MsgMultiSend': {
                    const v = value as MsgMultiSendTransaction['value'];

                    from = v.inputs[0].address;
                    amount = v.outputs.find(
                      (output) => output.address === address
                    )?.coins;

                    break;
                  }

                  case 'cyber.graph.v1beta1.MsgCyberlink': {
                    const v = value as CyberLinkTransaction['value'];

                    from = v.links[0].from;
                    text = 'todo: cyberlink text';

                    break;
                  }

                  default: {
                    if (!isParticle) {
                      console.error('unknown type', type);
                      return null;
                    }
                  }
                }
              }

              return (
                <Message
                  key={i}
                  address={from!}
                  text={text || ''}
                  txHash={hash}
                  amountData={{
                    amount,
                    isAmountSend,
                  }}
                  date={timestamp}
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
