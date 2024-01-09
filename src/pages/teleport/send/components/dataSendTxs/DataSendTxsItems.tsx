import { Coin } from '@cosmjs/launchpad';
import { AmountDenom, Cid } from 'src/components';
import { PATTERN_IPFS_HASH } from 'src/utils/config';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import { useEffect, useState } from 'react';
import { parseArrayLikeToDetails } from 'src/services/ipfs/utils/content';
import { IPFSContentDetails } from 'src/services/ipfs/ipfs';
import ContentIpfs from 'src/components/contentIpfs/contentIpfs';
import cx from 'classnames';
import { trimString } from 'src/utils/utils';
import styles from './DataSendTxs.module.scss';

function MemoIpfsContent({ cid }: { cid: string }) {
  const { status, content, fetchParticle } = useQueueIpfsContent(cid);
  const [ipfsDataDetails, setIpfsDatDetails] = useState<IPFSContentDetails>();

  useEffect(() => {
    (async () => {
      cid && fetchParticle && (await fetchParticle(cid));
    })();
  }, [cid, fetchParticle]);

  useEffect(() => {
    if (status !== 'completed') {
      return;
    }
    (async () => {
      const details = await parseArrayLikeToDetails(content, cid);
      setIpfsDatDetails(details);
    })();
  }, [content, status, cid]);

  if (status !== 'completed') {
    return (
      <Cid cid={cid}>
        <span>{trimString(cid, 5, 6)}</span>
      </Cid>
    );
  }

  return <ContentIpfs details={ipfsDataDetails} content={content} cid={cid} />;
}

export function Memo({ memo, receive }: { memo: string; receive: boolean }) {
  let content: string | JSX.Element = memo;

  if (memo.match(PATTERN_IPFS_HASH)) {
    content = <MemoIpfsContent cid={memo} />;
  }

  return (
    <div
      className={cx(styles.containerMemo, {
        [styles.containerMemoStart]: receive,
      })}
    >
      {content}
    </div>
  );
}

export function AmountDenomColor({
  coins,
  receive,
}: {
  coins: Coin[];
  receive?: boolean;
}) {
  return (
    <div
      className={cx(styles.amountDenomContainer, {
        [styles.amountDenomContainerRed]: receive,
      })}
    >
      {coins.map((item, i) => {
        return (
          <AmountDenom denom={item.denom} amountValue={item.amount} key={i} />
        );
      })}
    </div>
  );
}
