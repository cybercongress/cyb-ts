import { Account } from 'src/components';
import { timeSince } from 'src/utils/utils';
import useRank from 'src/features/cyberlinks/rank/useRank';
import { Link } from 'react-router-dom';
import { routes } from 'src/routes';
import ParticleSize from 'src/features/particle/ParticleSize/ParticleSize';
import useGetCreator from '../../hooks/useGetCreator';
import styles from './AdviserMeta.module.scss';

type Props = {
  cid: string;
  type: string | undefined;
};

function AdviserMeta({ cid, type }: Props) {
  const { creator } = useGetCreator(cid);
  const rank = useRank(cid);

  return (
    <div className={styles.meta}>
      <div className={styles.left}>
        <span>{type}</span>

        {!!rank && (
          <div className={styles.rank}>
            <span className={styles.number}>
              {rank.toLocaleString().replaceAll(',', ' ')}
            </span>
            <Link
              to="https://docs.cyb.ai/#/page/cyberank"
              replace
              target="_blank"
            >
              🦠
            </Link>
            {/* <Rank hash={cid} rank={rank} /> */}
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
        <ParticleSize cid={cid} />
        <Link to={routes.robot.routes.soul.path}>🌓</Link>
      </div>
    </div>
  );
}

export default AdviserMeta;
