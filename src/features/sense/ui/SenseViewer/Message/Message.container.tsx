import { selectCurrentAddress } from 'src/redux/features/pocket';
import { useAppSelector } from 'src/redux/hooks';

import Message from './Message';
import useParticleDetails from '../../../../particle/useParticleDetails';
import ContentIpfs from 'src/components/contentIpfs/contentIpfs';
import { Dots } from 'src/components';
import { routes } from 'src/routes';
import { Link } from 'react-router-dom';
import { SenseItem } from 'src/features/sense/redux/sense.redux';
import { formatSenseItemDataToUI } from '../../utils/format';

type Props = {
  senseItem: SenseItem;
};

function MessageContainer({ senseItem }: Props) {
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

  function renderCidContent() {
    if (cid) {
      if (loading) {
        return (
          <span>
            resolving particle <Dots />
          </span>
        );
        // eslint-disable-next-line no-else-return
      } else if (data) {
        return (
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
                <Link to={routes.oracle.ask.getLink(cid)} target="_blank">
                  full content
                </Link>
              </>
            )}
          </>
        );
      }
    }
  }

  return (
    <Message
      address={from}
      txHash={transactionHash}
      date={timestamp}
      content={cid ? renderCidContent() : text}
      amountData={{
        amount,
        isAmountSendToMyAddress,
      }}
      status={senseItem.status}
    />
  );
}

export default MessageContainer;
