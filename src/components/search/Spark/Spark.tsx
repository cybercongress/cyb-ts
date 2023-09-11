import { Pane } from '@cybercongress/gravity';
import { useDevice } from 'src/contexts/device';
import { exponentialToDecimal, timeSince } from 'src/utils/utils';
import { IpfsContentType } from 'src/utils/ipfs/ipfs';
import ContentItem from 'src/components/ContentItem/contentItem';
import Rank from 'src/components/Rank/rank';
import { useHover } from 'src/hooks/useHover';
import Meta from './Meta/Meta';
import styles from './Spark.module.scss';
import cx from 'classnames';
import useGetCreator from 'src/containers/ipfs/hooks/useGetCreator';
import dateFormat from 'dateformat';
import Account from 'src/components/account/account';

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
  handleContentType,
  handleRankClick,
}: Props) {
  const { isMobile } = useDevice();

  const [ref, hovering] = useHover();

  const { creator } = useGetCreator(cid);

  return (
    <div className={cx(styles.wrapper, 'hover-rank')} ref={ref}>
      {hovering && creator && (
        <div className={styles.left}>
          <Account address={creator.address} avatar />
          <span className={styles.date}>
            {timeSince(Date.parse(creator.timestamp) / 1000)} ago
            {/* {dateFormat(creator.timestamp, 'dd/mm/yyyy')} */}
          </span>

          <Pane
            className={cx(
              'time-discussion hover-rank-contentItem',
              styles.rank
            )}
            //   ${
            //     rankLink === key ? '' : ''
            //   }

            position="absolute"
            cursor="pointer"
          >
            <Rank
              hash={cid}
              rank={exponentialToDecimal(
                parseFloat(itemData.rank).toPrecision(3)
              )}
              grade={itemData.grade}
              onClick={() => handleRankClick(cid)}
            />
          </Pane>
        </div>
      )}

      <div className={styles.right}>{hovering && <Meta cid={cid} />}</div>

      <ContentItem
        setType={handleContentType}
        cid={cid}
        item={itemData}
        parent={query}
        className="SearchItem"
      />
    </div>
  );
}

export default Spark;
