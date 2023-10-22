import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import { formatCurrency } from 'src/utils/utils';
import { PREFIXES } from 'src/containers/ipfs/components/metaInfo';
import useGetBackLink from '../../../../containers/ipfs/hooks/useGetBackLink';
import useGetAnswers from '../../../../containers/ipfs/hooks/useGetAnswers';
// import useGetDiscussion from '../../../../containers/ipfs/hooks/useGetDiscussion';
import styles from './Meta.module.scss';
import Links from './Links/Links';
import { useNavigate } from 'react-router-dom';
import { routes } from 'src/routes';
import { useEffect } from 'react';

type Props = {
  cid: string;
};

function Meta({ cid }: Props) {
  const { total } = useGetBackLink(cid);
  const dataAnswer = useGetAnswers(cid);
  const { content, fetchParticle } = useQueueIpfsContent(cid);

  useEffect(() => {
    fetchParticle && (async () => fetchParticle(cid))();
  }, [cid, fetchParticle]);

  const navigate = useNavigate();

  const size = content?.meta?.size;

  return (
    <div className={styles.meta}>
      <Links
        to={total}
        from={dataAnswer?.total}
        onChange={() => {
          navigate(routes.ipfs.getLink(cid));
        }}
      />

      {size && (
        <span className={styles.size}>
          🟥 {formatCurrency(size, 'B', 0, PREFIXES)}
        </span>
      )}
    </div>
  );
}

export default Meta;
