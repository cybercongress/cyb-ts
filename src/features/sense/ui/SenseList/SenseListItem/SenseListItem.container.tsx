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
import { isParticle } from 'src/features/particle/utils';

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

  const particle = isParticle(senseItemId);

  const details = useParticleDetails(senseItemId, {
    skip: !particle,
  });

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
            hide1Boot={!!text}
            type={
              !isAmountSendToMyAddress ? CoinAction.send : CoinAction.receive
            }
          />
        )}
      </>
    );
  }

  const withAmount = Boolean(amount?.length);

  function formatParticleTitle(text: string) {
    return text.trim().substring(0, 20).replaceAll('#', '');
  }

  const { type, text: particleText } = details.data || {};

  const icon =
    type && contentTypeConfig[type as keyof typeof contentTypeConfig]?.label;

  return (
    <SenseListItem
      address={senseItemId}
      timestamp={timestamp}
      title={particleText ? formatParticleTitle(particleText) : icon}
      unreadCount={unreadCount}
      value={content}
      withAmount={withAmount}
      status={senseData.status}
    />
  );
}

export default SenseListItemContainer;
