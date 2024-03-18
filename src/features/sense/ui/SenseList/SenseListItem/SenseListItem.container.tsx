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
import { cutSenseItem } from '../../utils';

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
    formatSenseItemDataToUI(senseData, address, senseItemId);

  const particle = isParticle(senseItemId);

  const chatParticleDetails = useParticleDetails(senseItemId, {
    skip: !particle,
  });

  const { data, loading } = useParticleDetails(cid!, {
    skip: Boolean(text && !cid),
  });

  let content;

  if (cid) {
    if (loading) {
      content = (
        <span>
          resolving particle <Dots />
        </span>
      );
    } else if (data) {
      content =
        data.text?.replaceAll('#', '') ||
        contentTypeConfig[data.type]?.label ||
        'unsupported type';
    }
  } else {
    content = text;
  }

  function formatParticleTitle(text?: string, type: string) {
    if (type === 'image' || !text) {
      return null;
    }

    return text.trim().substring(0, 30).replaceAll('#', '');
  }

  const { text: particleText } = chatParticleDetails.data || {};

  return (
    <SenseListItem
      address={senseItemId}
      date={timestamp}
      title={formatParticleTitle(particleText, data?.type)}
      unreadCount={unreadCount}
      content={content}
      status={senseData.status}
      amountData={{ amount, isAmountSendToMyAddress }}
    />
  );
}

export default SenseListItemContainer;
