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

type Props = {
  selected: string | undefined;
};

const supportedTypes = Object.values(SupportedTypes);

function Area({ selected }: Props) {
  const { senseApi } = useBackend();

  const address = useAppSelector(selectCurrentAddress);

  const getTxsQuery = useQuery({
    queryKey: ['senseApi', 'getList', selected],
    queryFn: async () => {
      return senseApi!.getTransactions(selected!);
    },
    enabled: !!senseApi,
  });

  // TODO:remove
  const items = getTxsQuery.data
    ?.filter((item) => {
      return supportedTypes.includes(item.type);
    })
    .splice(0, 3);

  console.log('----getTxsQuery', getTxsQuery);
  console.log('items', items);

  return (
    <div className={styles.wrapper}>
      <Display
        title={
          selected && (
            <DisplayTitle title={<Account address={selected} avatar />} />
          )
        }
      >
        <div className={styles.content}>
          {items ? (
            items.map(({ id, timestamp, type, value, hash }, i) => {
              let v = JSON.parse(value);

              let from;
              let amount: Coin[] | undefined;

              switch (type) {
                case SupportedTypes.MsgSend: {
                  from = v.from_address;
                  amount = v.amount;

                  break;
                }

                case SupportedTypes.MsgMultiSend: {
                  v = v as MsgMultiSend;

                  from = v.inputs[0].address;
                  amount = v.outputs.find(
                    (output) => output.address === address
                  )?.coins;

                  break;
                }

                default:
                  return null;
              }

              return (
                <Message
                  key={i}
                  address={from}
                  text={type}
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
