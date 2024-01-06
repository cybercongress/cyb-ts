import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import styles from './Area.module.scss';
import { useBackend } from 'src/contexts/backend';
import { Account } from 'src/components';
import { useQuery } from '@tanstack/react-query';
import Message from './Message/Message';
import { MsgMultiSend, MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import { SupportedTypes } from '../types';
import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import useSenseItem from '../useSenseItem';
import { routes } from 'src/routes';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

type Props = {
  selected: string | undefined;
};

// const supportedTypes = Object.values(SupportedTypes);

function Area({ selected }: Props) {
  const address = useAppSelector(selectCurrentAddress);

  const { senseApi } = useBackend();

  const { data, loading, error } = useSenseItem({ id: selected });

  useEffect(() => {
    if (!selected) {
      return;
    }

    senseApi?.markAsRead(selected);
  }, [selected, senseApi]);

  const isParticle = selected?.startsWith('Qm');

  return (
    <div className={styles.wrapper}>
      <Display
        title={
          selected && (
            <DisplayTitle
              title={
                isParticle ? (
                  <Link
                    className={styles.title}
                    to={routes.oracle.ask.getLink(selected)}
                  >
                    {selected}
                  </Link>
                ) : (
                  <Account address={selected} avatar />
                )
              }
            />
          )
        }
      >
        <div className={styles.content}>
          {selected && data ? (
            data.map(({ id, timestamp, type, value, text, hash, from }, i) => {
              let v = value;

              let from2;
              let amount: Coin[] | undefined;

              switch (type) {
                case SupportedTypes.MsgSend: {
                  from2 = v.from_address;
                  amount = v.amount;

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
                  text={type || text}
                  txHash={hash}
                  amount={amount}
                  date={timestamp}
                  // type={type}
                />
              );
            })
          ) : (
            <p>
              post to your log, <br />
              or select chat to start messaging
            </p>
          )}
        </div>
      </Display>
    </div>
  );
}

export default Area;
