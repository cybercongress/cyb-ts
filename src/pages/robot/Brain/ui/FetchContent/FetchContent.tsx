import { Dots } from 'src/components';
import ContentIpfs from 'src/components/contentIpfs/contentIpfs';
import useParticleDetails from 'src/features/particle/useParticleDetails';

function FetchContent({ cid, parentId }: { cid: string; parentId: string }) {
  const { data, loading } = useParticleDetails(
    cid!,
    {
      skip: Boolean(!cid),
    },
    parentId
  );

  if (loading) {
    return (
      <span>
        resolving particle <Dots />
      </span>
    );
  }

  return (
    <ContentIpfs details={data} cid={cid} content={data?.content} search />
  );
}

export default FetchContent;
