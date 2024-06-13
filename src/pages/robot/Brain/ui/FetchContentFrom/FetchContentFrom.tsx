import { Cid } from 'src/components';
import useParticleDetails from 'src/features/particle/useParticleDetails';
import { trimString } from 'src/utils/utils';

function FetchContentFrom({
  cid,
  parentId,
}: {
  cid: string;
  parentId: string;
}) {
  const { data, loading } = useParticleDetails(
    cid!,
    {
      skip: Boolean(!cid),
    },
    parentId
  );

  if (
    !loading &&
    data?.type === 'text' &&
    data.content &&
    data.content?.length <= 100
  ) {
    return <span>{data.content}</span>;
  }

  return <Cid cid={cid}>{trimString(cid)}</Cid>;
}

export default FetchContentFrom;
