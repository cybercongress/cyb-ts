import { ContainerGradientText } from 'src/components';
import { HistoriesItem } from '../../ibc-history/HistoriesItem';
import useGetStatus from '../../ibc-history/useGetStatus';
import { AmountSend, CreatedAt, RouteAddress, Status, TypeTsx } from './compDataHstory';
import styles from './styles.module.scss'

function DataIbcHistoryItem({ item }: { item: HistoriesItem }) {
  const statusTrace = useGetStatus(item);

  return (
    <ContainerGradientText>
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
    </ContainerGradientText>
  );
}

export default DataIbcHistoryItem;
