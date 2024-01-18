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

function SenseListItemContainer({ senseListItem }: Props) {
  const { id, entryType, meta, timestampUpdate, unreadCount } = senseListItem;

  const address = useAppSelector(selectCurrentAddress);

  let text;
  let amount;
  let isAmountSend = false;
  let cidText;

  switch (entryType) {
    case EntryType.particle:
      text = meta.id?.text;
      break;
    case EntryType.chat:
      text = meta.memo;
      amount = meta.amount;
      isAmountSend = meta.direction === 'to';
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
        ) : data ? (
          data.text || contentTypeConfig[data.type]?.label || ''
        ) : (
          'unsuported type'
        )}
      </>
    );
  } else {
    content = (
      <>
        <span>{text}</span>
        {amount?.map((a) => {
          return (
            <CoinAmount
              amount={a.amount}
              denom={a.denom}
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
      timestamp={timestampUpdate}
      unreadCount={unreadCount}
      value={content}
      cidText={cidText}
      withAmount={withAmount}
    />
  );
}

export default SenseListItemContainer;
