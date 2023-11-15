import { useDevice } from 'src/contexts/device';
import { IpfsContentType } from 'src/utils/ipfs/ipfs';
import ContentItem from 'src/components/ContentItem/contentItem';
import { useHover } from 'src/hooks/useHover';
import cx from 'classnames';

import Meta from './Meta/Meta';
import styles from './Spark.module.scss';
import Creator from './LeftMeta/Creator/Creator';
import RankButton from './LeftMeta/RankButton/RankButton';

type Props = {
  cid: string;
  handleContentType: (type: IpfsContentType) => void;
  handleRankClick: (cid: string) => void;
  itemData: {};
  query: string;
};

function Spark({
  cid,
  itemData,
  query,
  linkType,
  rankSelected,
  handleContentType,
  handleRankClick,
}: Props) {
  const { isMobile } = useDevice();
  const [ref, hovering] = useHover();

  return (
    <div className={cx(styles.wrapper, 'hover-rank')} ref={ref}>
      {!isMobile && hovering && (
        <>
          <div className={styles.left}>
            <Creator cid={cid} />
            <RankButton
              cid={cid}
              rankSelected={rankSelected}
              handleRankClick={handleRankClick}
            />
          </div>

          {/* TODO: refact. meta should be moved inside contentItem and exclude fetchParticle from that  */}
          <div className={styles.right}>
            <Meta cid={cid} />
          </div>
        </>
      )}

      <ContentItem
        setType={handleContentType}
        cid={cid}
        item={itemData}
        parent={query}
        linkType={linkType}
        className={styles.searchItem}
      />
    </div>
  );
}

export default Spark;
