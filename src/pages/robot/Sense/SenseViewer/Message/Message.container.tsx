import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { useAppSelector } from 'src/redux/hooks';
import {
  LinkDbEntity,
  TransactionDbEntity,
} from 'src/services/CozoDb/types/entities';
import {
  CyberLinkTransaction,
  MsgMultiSendTransaction,
  MsgSendTransaction,
} from 'src/services/backend/services/dataSource/blockchain/types';
import Message from './Message';
import useParticleDetails from '../../_refactor/useParticleDetails';
import ContentIpfs from 'src/components/contentIpfs/contentIpfs';
import Loader2 from 'src/components/ui/Loader2';
import { Dots } from 'src/components';

type Props = {
  senseItem: LinkDbEntity | TransactionDbEntity;
  isParticle?: boolean;
};

function MessageContainer({ senseItem, isParticle }: Props) {
  const address = useAppSelector(selectCurrentAddress);

  const { timestamp, hash: h } = senseItem;

  let text;
  let from;
  let amount: Coin[] | undefined;
  let isAmountSend = false;
  let hash = h;
  let resolveCid;

  if (isParticle) {
    const item = senseItem as LinkDbEntity;

    from = item.from;
    text = item.text;
    hash = item.transactionHash;
    from = item.neuron;
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
        amount = v.outputs.find((output) => output.address === address)?.coins;

        break;
      }

      case 'cyber.graph.v1beta1.MsgCyberlink': {
        const v = value as CyberLinkTransaction['value'];

        from = v.neuron;
        resolveCid = v.links[0].to;

        break;
      }

      default: {
        if (!isParticle) {
          console.error('unknown type', type);
          //   return null;
        }
      }
    }
  }

  const { data, loading } = useParticleDetails(resolveCid, {
    skip: !resolveCid,
  });

  console.log('data', data);

  return (
    <Message
      address={from!}
      text={
        (resolveCid && (
          <>
            {loading ? (
              <span>
                resolving particle <Dots />
              </span>
            ) : data ? (
              <ContentIpfs
                details={data}
                cid={data.cid}
                content={data.content}
                search
              />
            ) : (
              ''
            )}
          </>
        )) ||
        text
      }
      txHash={hash}
      amountData={{
        amount,
        isAmountSend,
      }}
      date={timestamp}
    />
  );
}

export default MessageContainer;
