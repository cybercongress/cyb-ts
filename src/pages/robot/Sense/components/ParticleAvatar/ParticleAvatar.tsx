import styles from './ParticleAvatar.module.scss';
import useParticleDetails from '../../_refactor/useParticleDetails';
import { contentTypeConfig } from 'src/containers/Search/Filters/Filters';
import { Dots } from 'src/components';

function ParticleAvatar({ particleId }: { particleId: string }) {
  const { data, loading } = useParticleDetails(particleId);

  const type = data?.type;

  const icon =
    type && contentTypeConfig[type as keyof typeof contentTypeConfig]?.label;

  return <div className={styles.wrapper}>{loading ? <Dots /> : icon}</div>;
}

export default ParticleAvatar;
