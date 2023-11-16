import { Coin } from '@cosmjs/launchpad';
import { AmountDenom } from 'src/components';
import { PATTERN_IPFS_HASH } from 'src/utils/config';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import { useEffect, useState } from 'react';
import { parseArrayLikeToDetails } from 'src/services/ipfs/utils/content';
import { IPFSContentDetails } from 'src/services/ipfs/ipfs';
import ContentIpfs from 'src/components/contentIpfs/contentIpfs';
import styles from './styles.module.scss';

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

  return <ContentIpfs details={ipfsDataDetails} content={content} cid={cid} />;
}

export function Memo({ memo, receive }: { memo: string; receive: boolean }) {
  let content: string | JSX.Element = memo;

  if (memo.match(PATTERN_IPFS_HASH)) {
    content = <MemoIpfsContent cid={memo} />;
  }

  return (
    <div
      className={styles.containerMemo}
      style={{
        textAlign: receive ? 'start' : 'end',
      }}
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
      style={{
        color: receive ? '#76FF03' : '#FF5C00',
      }}
    >
      {coins.map((item, i) => {
        return (
          <AmountDenom denom={item.denom} amountValue={item.amount} key={i} />
        );
      })}
    </div>
  );
}
