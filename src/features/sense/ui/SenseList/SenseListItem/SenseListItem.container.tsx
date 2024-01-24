import { EntryType } from 'src/services/CozoDb/types/entities';
import { CoinAmount, CoinAction } from '../../SenseViewer/Message/Message';

import { SenseListItem as SenseListItemType } from 'src/services/backend/types/sense';
import useParticleDetails from '../../../../particle/useParticleDetails';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { useAppSelector } from 'src/redux/hooks';
import { contentTypeConfig } from 'src/containers/Search/Filters/Filters';
import { Dots } from 'src/components';
import SenseListItem from './SenseListItem';
import { formatSenseItemDataToUI } from '../../utils/format';

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
  const address = useAppSelector(selectCurrentAddress);

  const { timestamp, amount, cid, text, amountSendDirection } =
    formatSenseItemDataToUI(senseData, address);

  console.log(
    'SenseListItemContainer',
    senseData,
    senseId,
    timestamp,
    amount,
    cid,
    text,
    amountSendDirection
  );

  const { data, loading } = useParticleDetails(cid!, {
    skip: Boolean(text && !cid),
  });

  let content;

  if (cid) {
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
              type={
                amountSendDirection === 'from'
                  ? CoinAction.send
                  : CoinAction.receive
              }
            />
          );
        })}
      </>
    );
  }

  const withAmount = Boolean(amount?.length);

  return (
    <SenseListItem
      address={senseId}
      timestamp={timestamp}
      unreadCount={unreadCount}
      value={content}
      withAmount={withAmount}
      status={senseData.status}
    />
  );
}

export default SenseListItemContainer;
