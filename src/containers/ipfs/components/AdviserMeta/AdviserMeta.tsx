import { Rank, Account } from 'src/components';
import { timeSince, formatCurrency } from 'src/utils/utils';
import useGetCreator from '../../hooks/useGetCreator';
import { PREFIXES } from '../metaInfo';
import styles from './AdviserMeta.module.scss';
import useRank from 'src/features/cyberlinks/rank/useRank';

type Props = {
  cid: string;
  type: string | undefined;
  size: number | undefined;
};

function AdviserMeta({ cid, type, size }: Props) {
  const { creator } = useGetCreator(cid);
  const rank = useRank(cid);

  return (
    <div className={styles.meta}>
      <div className={styles.left}>
        {type}

        {!!rank && (
          <div className={styles.rank}>
            with rank
            <span>{rank.toLocaleString().replaceAll(',', ' ')}</span>
            <Rank hash={cid} rank={rank} />
          </div>
        )}
      </div>
      {creator && (
        <div className={styles.center}>
          <span className={styles.date}>
            {timeSince(Date.now() - Date.parse(creator.timestamp))} ago
          </span>
          <Account sizeAvatar="20px" address={creator.address} avatar />
        </div>
      )}
      <div className={styles.right}>
        <span>
          🟥 {size !== -1 ? formatCurrency(size, 'B', 0, PREFIXES) : 'unknown'}
        </span>
        <button disabled>🌓</button>
      </div>
    </div>
  );
}

export default AdviserMeta;
