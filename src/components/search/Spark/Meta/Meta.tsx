import useGetBackLink from '../../../../containers/ipfs/hooks/useGetBackLink';
import useGetAnswers from '../../../../containers/ipfs/hooks/useGetAnswers';
// import useGetDiscussion from '../../../../containers/ipfs/hooks/useGetDiscussion';
import useGetCommunity from '../../../../containers/ipfs/hooks/useGetCommunity';
import Account from 'src/components/account/account';
import styles from './Meta.module.scss';
import { Copy } from '../../../ui/copy';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import { formatCurrency } from 'src/utils/utils';
import { PREFIXES } from 'src/containers/ipfs/components/metaInfo';

type Props = {
  cid: string;
};

function Meta({ cid }: Props) {
  // const { community } = useGetCommunity(cid);
  const { backlinks } = useGetBackLink(cid);
  const dataAnswer = useGetAnswers(cid);
  const { content } = useQueueIpfsContent(cid, 1, cid);

  const size = content?.meta?.size;

  return (
    <div className={styles.meta}>
      {/* <span>🟢 (type)</span> */}
      <div className={styles.links}>
        {backlinks?.length} &rarr; <span></span> &rarr; {dataAnswer.total}
      </div>

      {size && (
        <span className={styles.size}>
          🟥 {formatCurrency(size, 'B', 3, PREFIXES)}
        </span>
      )}
      {/* <div className={styles.community}>
        {community?.map((item) => {
          return <Account key={item} address={item} onlyAvatar avatar />;
        })}
      </div> */}
    </div>
  );
}

export default Meta;
