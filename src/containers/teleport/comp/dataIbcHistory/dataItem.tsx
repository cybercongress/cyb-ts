import { HistoriesItem } from '../../ibc-history/HistoriesItem';
import useGetStatus from '../../ibc-history/useGetStatus';
import { AmountSend, CreatedAt, RouteAddress, Status, TypeTsx } from './compDataHstory';
import styles from './styles.module.scss'
import Display from 'src/components/containerGradient/Display/Display';

function DataIbcHistoryItem({ item }: { item: HistoriesItem }) {
  const statusTrace = useGetStatus(item);

  return (
    <Display>
      <div className={styles.containerDataIbc}>
        <div className={styles.containerDataIbcFlexBetween}>
          <TypeTsx sourceChainId={item.sourceChainId} />

          <RouteAddress item={item} />
        </div>

        <div className={styles.containerDataIbcFlexBetween}>
          <AmountSend coin={item.amount} sourceChainId={item.sourceChainId} />

          <div className={styles.containerDataIbcTimeStatus}>
            <Status status={statusTrace} />

            <CreatedAt timeAt={item.createdAt} />
          </div>
        </div>
      </div>
    </Display>
  );
}

export default DataIbcHistoryItem;
