import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import styles from './SenseViewer.module.scss';
import { useBackend } from 'src/contexts/backend';
import { Account } from 'src/components';
import { useQuery } from '@tanstack/react-query';
import Message from './Message/Message';
import { MsgMultiSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import { SupportedTypes } from '../types';
import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import useSenseItem from '../_refactor/useSenseItem';
import { routes } from 'src/routes';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Loader2 from 'src/components/ui/Loader2';
import { cutSenseItem } from '../utils';
import ParticleAvatar from '../components/ParticleAvatar/ParticleAvatar';
import useParticleDetails from '../_refactor/useParticleDetails';
import { isParticle as isParticleFunc } from 'src/features/particles/utils';
import { EntryType } from 'src/services/CozoDb/types/entities';

type Props = {
  selected: string | undefined;
};

const REFETCH_INTERVAL = 1000 * 20;

function SenseViewer({ selected }: Props) {
  const { senseApi } = useBackend();

  const address = useAppSelector(selectCurrentAddress);
  const enabled = Boolean(senseApi && address);

  const getListQuery = useQuery({
    queryKey: ['senseApi', 'getList', address],
    queryFn: async () => {
      return senseApi!.getList(address!);
    },
    enabled,
  });

  const entryType = selected
    ? getListQuery?.data?.find((item) => item.id === selected)?.entryType
    : undefined;
  const isChatEntry = entryType === EntryType.chat;

  const isParticle = isParticleFunc(selected || '');

  const { data: particleData } = useParticleDetails(selected, {
    skip: !isParticle || isChatEntry,
  });

  const { data, loading, error } = useSenseItem({ id: selected });

  const getChatQuery = useQuery({
    queryKey: ['senseApi', 'getMyChats', address, selected],
    queryFn: async () => {
      return senseApi!.getMyChats(address!, selected!);
    },
    enabled: !!(senseApi && address && selected && isChatEntry),
    refetchInterval: REFETCH_INTERVAL,
    onSuccess(data) {
      console.log('--getChatQuery', data);
    },
  });

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

  const items = isChatEntry ? getChatQuery.data?.reverse() : data;

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
            {items.map(
              ({ id, timestamp, type, value, text, memo, hash, from }, i) => {
                let v = value;

                let from2;
                let amount: Coin[] | undefined;

                switch (type) {
                  case SupportedTypes.MsgSend: {
                    from2 = v.from_address;
                    amount = v.amount;
                    v = memo;

                    break;
                  }

                  case SupportedTypes.MsgMultiSend: {
                    v = v as MsgMultiSend;

                    from2 = v.inputs[0].address;
                    amount = v.outputs.find(
                      (output) => output.address === address
                    )?.coins;

                    break;
                  }

                  default: {
                    if (!isParticle) {
                      return null;
                    }

                    from2 = from;
                  }
                }

                return (
                  <Message
                    key={i}
                    address={from2}
                    text={text || memo}
                    txHash={hash}
                    amount={amount}
                    date={timestamp}
                    // type={type}
                  />
                );
              }
            )}
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
