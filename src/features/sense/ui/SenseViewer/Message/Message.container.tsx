import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { useAppSelector } from 'src/redux/hooks';
import { LinkDbEntity } from 'src/services/CozoDb/types/entities';
import {
  MsgMultiSendTransaction,
  MsgSendTransaction,
} from 'src/services/backend/services/dataSource/blockchain/types';
import Message from './Message';
import useParticleDetails from '../../_refactor/useParticleDetails';
import ContentIpfs from 'src/components/contentIpfs/contentIpfs';
import { Dots } from 'src/components';
import { routes } from 'src/routes';
import { Link } from 'react-router-dom';
import { SenseItem } from 'src/features/sense/redux/sense.redux';
import { SenseMetaType } from 'src/services/backend/types/sense';

type Props = {
  senseItem: SenseItem;
};

function MessageContainer({ senseItem }: Props) {
  const address = useAppSelector(selectCurrentAddress);

  const { timestamp, itemType, id, value, memo } = senseItem;

  let from;
  let text;
  let amount: Coin[] | undefined;
  let hash = senseItem.hash;

  // FIXME:
  let isAmountSend = false;
  let resolveCid;

  switch (itemType) {
    case SenseMetaType.send: {
      const v = value as MsgSendTransaction['value'];

      from = v.from_address || id;

      if (v.amount) {
        amount = Array.isArray(v.amount) ? v.amount : Object.values(v.amount);
      }

      text = memo;
      isAmountSend = v.from_address === address;

      if (senseItem.type === 'cosmos.bank.v1beta1.MsgMultiSend') {
        const v = value as MsgMultiSendTransaction['value'];

        from = v.inputs[0].address;
        amount = v.outputs.find((output) => output.address === address)?.coins;
      }

      break;
    }

    case SenseMetaType.particle: {
      // const item = senseItem as LinkDbEntity;

      from = senseItem.from;
      text = senseItem.id?.text;
      hash = senseItem.transactionHash;

      break;
    }

    case SenseMetaType.follow: {
      debugger;

      break;
    }
    case SenseMetaType.tweet: {
      text = senseItem.text;
      from = senseItem.neuron;
      resolveCid = senseItem.to;

      break;
    }

    case SenseMetaType.transaction: {
      text = senseItem.text;
      from = senseItem.neuron;
      resolveCid = senseItem.to;

      break;
    }

    default: {
      console.error('unknown type');
      debugger;
    }
  }

  const { data, loading } = useParticleDetails(resolveCid, {
    skip: !resolveCid,
  });

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
            ) : (
              data && (
                <>
                  <ContentIpfs
                    details={data}
                    cid={data.cid}
                    content={data.content}
                    search
                  />

                  {data.type === 'text' && data.text?.endsWith('...') && (
                    <>
                      <br />
                      <Link
                        to={routes.oracle.ask.getLink(resolveCid)}
                        target="_blank"
                      >
                        full content
                      </Link>
                    </>
                  )}
                </>
              )
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
