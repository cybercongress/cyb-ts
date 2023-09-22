import { useDevice } from 'src/contexts/device';
import { coinDecimals, exponentialToDecimal, timeSince } from 'src/utils/utils';
import { IpfsContentType } from 'src/utils/ipfs/ipfs';
import ContentItem from 'src/components/ContentItem/contentItem';
import Rank from 'src/components/Rank/rank';
import { useHover } from 'src/hooks/useHover';
import styles from './Spark.module.scss';
import cx from 'classnames';
import useGetCreator from 'src/containers/ipfs/hooks/useGetCreator';
import dateFormat from 'dateformat';
import Account from 'src/components/account/account';
import Tooltip from 'src/components/tooltip/tooltip';
import Meta from './Meta/Meta';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { getRankGrade } from 'src/utils/search/utils';

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
  handleContentType,
  handleRankClick,
}: Props) {
  const { isMobile } = useDevice();

  const [ref, hovering] = useHover();

  const queryClient = useQueryClient();

  const { creator } = useGetCreator(cid);

  const [rankInfo, setRankInfo] = useState(null);

  useEffect(() => {
    (async () => {
      if (itemData.rank) {
        return;
      }
      const response = await queryClient?.rank(cid);

      const rank = coinDecimals(parseFloat(response.rank));
      const rankData = {
        rank: exponentialToDecimal(rank.toPrecision(3)),
        grade: getRankGrade(rank),
      };
      setRankInfo(rankData);
    })();
  }, [cid, queryClient]);

  return (
    <div className={cx(styles.wrapper, 'hover-rank')} ref={ref}>
      {!isMobile && hovering && creator && (
        <div className={styles.left}>
          <Tooltip
            placement="bottom"
            tooltip={dateFormat(
              new Date(creator.timestamp),
              'dd/mm/yyyy, HH:MM'
            )}
          >
            <span className={styles.date}>
              {timeSince(Date.now() - Date.parse(creator.timestamp))} ago
            </span>
          </Tooltip>

          <Account address={creator.address} avatar />

          <button
            className={cx('hover-rank-contentItem', styles.rank)}
            type="button"
          >
            <Rank
              hash={cid}
              rank={exponentialToDecimal(
                parseFloat(itemData.rank || rankInfo?.rank).toPrecision(3)
              )}
              grade={itemData?.grade || rankInfo?.grade}
              onClick={() => handleRankClick(cid)}
            />
          </button>
        </div>
      )}

      {!isMobile && hovering && (
        <div className={styles.right}>
          <Meta cid={cid} />
        </div>
      )}

      <ContentItem
        setType={handleContentType}
        cid={cid}
        item={itemData}
        parent={query}
        linkType={linkType}
        className="SearchItem"
      />
    </div>
  );
}

export default Spark;
