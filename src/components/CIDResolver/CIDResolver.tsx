import { trimString } from 'src/utils/utils';
import { Cid } from '../link/link';
import useParticleDetails from 'src/features/particle/useParticleDetails';
import { Dots } from '../ui/Dots';

type Props = {
  cid: string;
};

function CIDResolver({ cid }: Props) {
  const { data, loading } = useParticleDetails(cid);

  if (!data?.content) {
    return (
      <Cid cid={cid}>
        {loading ? (
          <>
            loading <Dots />
          </>
        ) : (
          trimString(cid, 3, 3)
        )}
      </Cid>
    );
  }

  return data.content;
}

export default CIDResolver;
