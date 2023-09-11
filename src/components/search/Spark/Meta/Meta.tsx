import useGetBackLink from '../../../../containers/ipfs/hooks/useGetBackLink';
import useGetCreator from '../../../../containers/ipfs/hooks/useGetCreator';
import useGetAnswers from '../../../../containers/ipfs/hooks/useGetAnswers';
// import useGetDiscussion from '../../../../containers/ipfs/hooks/useGetDiscussion';
import useGetCommunity from '../../../../containers/ipfs/hooks/useGetCommunity';
import Account from 'src/components/account/account';
import styles from './Meta.module.scss';
import { Copy } from '../../../ui/copy';

type Props = {
  cid: string;
};

function Meta({ content, cid }: Props) {
  const { community } = useGetCommunity(cid);
  const { creator } = useGetCreator(cid);
  const { backlinks } = useGetBackLink(cid);
  const dataAnswer = useGetAnswers(cid);

  return (
    <div className={styles.meta}>
      <span className={styles.cid}>
        {cid.substring(0, 5)}...{cid.substring(cid.length - 5, cid.length)}{' '}
        <Copy text={cid} />
      </span>
      <span>🟥 4.877 KB</span>
      <span>🟢 (type)</span>
      <div className={styles.links}>
        {backlinks?.length} &rarr; <span></span> &rarr; {dataAnswer.total}
      </div>
      <div className={styles.community}>
        {community?.map((item) => {
          return (
            <div>
              <Account address={item} onlyAvatar avatar />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Meta;
