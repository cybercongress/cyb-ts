import { selectCurrentAddress } from 'src/redux/features/pocket';
import { useAppSelector } from 'src/redux/hooks';

import Message from './Message';
import useParticleDetails from '../../../../../particle/useParticleDetails';
import ContentIpfs from 'src/components/contentIpfs/contentIpfs';
import { Dots } from 'src/components';
import { SenseItem } from 'src/features/sense/redux/sense.redux';
import { formatSenseItemDataToUI } from '../../../utils/format';
import { getIpfsHash } from 'src/utils/ipfs/helpers';
import { useEffect, useState } from 'react';

type Props = {
  senseItem: SenseItem;
};

function MessageContainer({ senseItem }: Props) {
  const [textCid, setTextCid] = useState<string>();

  const address = useAppSelector(selectCurrentAddress);

  const {
    timestamp,
    transactionHash,
    amount,
    from,
    cid,
    text,
    isAmountSendToMyAddress,
  } = formatSenseItemDataToUI(senseItem, address);

  const { data, loading } = useParticleDetails(cid!, {
    skip: Boolean(text && !cid),
  });

  useEffect(() => {
    if (!text) {
      return;
    }

    (async () => {
      const cid = await getIpfsHash(text);

      console.debug('text', text);
      console.debug('cid', cid);

      setTextCid(cid);
    })();
  }, [text]);

  let content;

  if (cid) {
    if (loading) {
      content = (
        <span>
          resolving particle <Dots />
        </span>
      );
    } else if (data) {
      content = (
        <ContentIpfs
          details={data}
          cid={data.cid}
          content={data.content}
          search
        />
      );
    }
  } else if (text) {
    content = text;
  }

  return (
    <Message
      address={from}
      txHash={transactionHash}
      date={timestamp}
      content={content}
      cid={cid || textCid}
      amountData={{
        amount,
        isAmountSendToMyAddress,
        hide1Boot: !!text,
      }}
      status={senseItem.status}
    />
  );
}

export default MessageContainer;
