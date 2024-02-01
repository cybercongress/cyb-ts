import useParticleDetails from '../../../../particle/useParticleDetails';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { useAppSelector } from 'src/redux/hooks';
import { contentTypeConfig } from 'src/containers/Search/Filters/Filters';
import { Dots } from 'src/components';
import SenseListItem from './SenseListItem';
import { formatSenseItemDataToUI } from '../../utils/format';
import { SenseItemId } from 'src/features/sense/types/sense';
import CoinsAmount, {
  CoinAction,
} from '../../components/CoinAmount/CoinAmount';

type Props = {
  senseItemId: SenseItemId;
};

function SenseListItemContainer({ senseItemId }: Props) {
  const { senseData, unreadCount } = useAppSelector((store) => {
    const chat = store.sense.chats[senseItemId]!;

    const lastMsg = chat.data[chat.data.length - 1];

    return {
      senseData: lastMsg,
      unreadCount: chat.unreadCount,
    };
  });
  const address = useAppSelector(selectCurrentAddress);

  const { timestamp, amount, cid, text, isAmountSendToMyAddress } =
    formatSenseItemDataToUI(senseData, address);

  const { data, loading } = useParticleDetails(cid!, {
    skip: Boolean(text && !cid),
  });

  let content;

  if (cid) {
    content = (
      // eslint-disable-next-line react/jsx-no-useless-fragment
      <>
        {loading ? (
          <span>
            resolving particle <Dots />
          </span>
        ) : (
          data &&
          (data.text ||
            contentTypeConfig[data.type]?.label ||
            'unsupported type')
        )}
      </>
    );
  } else {
    content = (
      <>
        <span>{text}</span>

        {amount && (
          <CoinsAmount
            amount={amount}
            type={
              !isAmountSendToMyAddress ? CoinAction.send : CoinAction.receive
            }
          />
        )}
      </>
    );
  }

  const withAmount = Boolean(amount?.length);

  return (
    <SenseListItem
      address={senseItemId}
      timestamp={timestamp}
      unreadCount={unreadCount}
      value={content}
      withAmount={withAmount}
      status={senseData.status}
    />
  );
}

export default SenseListItemContainer;
