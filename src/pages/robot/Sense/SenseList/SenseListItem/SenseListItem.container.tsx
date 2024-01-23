import { EntryType } from 'src/services/CozoDb/types/entities';
import { CoinAmount, CoinAction } from '../../SenseViewer/Message/Message';

import { SenseListItem as SenseListItemType } from 'src/services/backend/types/sense';
import useParticleDetails from '../../_refactor/useParticleDetails';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { useAppSelector } from 'src/redux/hooks';
import { contentTypeConfig } from 'src/containers/Search/Filters/Filters';
import { Dots } from 'src/components';
import SenseListItem from './SenseListItem';

type Props = {
  senseListItem: SenseListItemType;
};

function SenseListItemContainer({ id: senseId }: Props) {
  const { senseData, unreadCount } = useAppSelector((store) => {
    const chat = store.sense.chats[senseId]!;

    const lastMsg = chat.data[chat.data.length - 1];

    return {
      senseData: lastMsg,
      unreadCount: chat.unreadCount,
    };
  });
  const { entryType, meta, memo, timestamp } = senseData;
  const id = senseId;

  const address = useAppSelector(selectCurrentAddress);

  let text = memo;
  let amount;
  let isAmountSend = false;
  let cidText;

  switch (entryType) {
    case EntryType.particle:
      text = meta.id?.text;
      break;
    case EntryType.chat:
      text = meta.memo || meta.lastId?.text;
      amount = meta.amount ? Object.values(meta.amount) : undefined;
      isAmountSend = meta.direction === 'to';
      // amount = meta.amount;
      // isAmountSend = meta.direction === 'to';
      break;
    case EntryType.transactions:
      text = meta.memo;

      if (meta.type === 'cosmos.bank.v1beta1.MsgMultiSend') {
        amount = meta.value.outputs.find(
          (output) => output.address === id
        )?.coins;
        break;
      }

      if (meta.type === 'cyber.graph.v1beta1.MsgCyberlink') {
        cidText = meta.value.links[0].to;
      }

      amount = meta.value.amount;
      isAmountSend = meta.value.from_address === address;
      break;

    default:
      break;
  }

  const { data, loading } = useParticleDetails(cidText, {
    skip: !cidText,
  });

  let content;

  if (cidText) {
    content = (
      <>
        {loading ? (
          <span>
            resolving particle <Dots />
          </span>
        ) : (
          data &&
          (data.text ||
            contentTypeConfig[data.type]?.label ||
            'unsuported type')
        )}
      </>
    );
  } else {
    content = (
      <>
        <span>{text}</span>
        {amount?.map(({ amount, denom }) => {
          if (denom === 'boot' && amount === '1') {
            return null;
          }

          return (
            <CoinAmount
              amount={amount}
              denom={denom}
              type={isAmountSend ? CoinAction.send : CoinAction.receive}
            />
          );
        })}
      </>
    );
  }

  const withAmount = Boolean(amount?.length);

  return (
    <SenseListItem
      address={id}
      timestamp={timestamp}
      unreadCount={unreadCount}
      value={content}
      cidText={cidText}
      withAmount={withAmount}
    />
  );
}

export default SenseListItemContainer;
