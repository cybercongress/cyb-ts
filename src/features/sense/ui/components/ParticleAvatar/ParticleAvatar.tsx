import styles from './ParticleAvatar.module.scss';
import useParticleDetails from '../../../../particle/useParticleDetails';
import { contentTypeConfig } from 'src/containers/Search/Filters/Filters';
import { Dots } from 'src/components';

function ParticleAvatar({ particleId }: { particleId: string }) {
  const { data, loading } = useParticleDetails(particleId);

  const type = data?.type;
  const isImgType = type === 'image';

  const icon =
    type && contentTypeConfig[type as keyof typeof contentTypeConfig]?.label;

  return (
    <div className={styles.wrapper}>
      {loading ? (
        <Dots />
      ) : isImgType ? (
        <img src={data?.content} alt={data?.cid} />
      ) : (
        icon
      )}
    </div>
  );
}

export default ParticleAvatar;
