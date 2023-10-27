import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import { formatCurrency } from 'src/utils/utils';
import { PREFIXES } from 'src/containers/ipfs/components/metaInfo';
import { useNavigate } from 'react-router-dom';
import { routes } from 'src/routes';
import { useEffect } from 'react';
import useCyberlinksCount from 'src/features/cyberlinks/hooks/useCyberlinksCount';
import Links from './Links/Links';
import styles from './Meta.module.scss';

type Props = {
  cid: string;
};

function Meta({ cid }: Props) {
  const { content, fetchParticle } = useQueueIpfsContent(cid);

  const { data: count } = useCyberlinksCount(cid);

  useEffect(() => {
    fetchParticle && (async () => fetchParticle(cid))();
  }, [cid, fetchParticle]);

  const navigate = useNavigate();

  const size = content?.meta?.size;

  return (
    <div className={styles.meta}>
      <Links
        to={count.to}
        from={count.from}
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
