
import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AccountValue } from 'src/types/defaultAccount';
import { Nullable } from 'src/types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import Display from 'src/components/containerGradient/Display/Display';
import { Colors } from 'src/components/containerGradient/types';
import { DataSendTxs } from './type';
import CreatedAt from '../CreatedAt/CreatedAt';
import { AmountDenomColor, Memo } from './DataSendTxsItems';
import styles from './styles.module.scss'

function DataSendTxs({
  dataSendTxs,
  accountUser,
}: {
  dataSendTxs: DataSendTxs;
  accountUser: Nullable<AccountValue>;
}) {
  const { data, fetchNextPage, hasNextPage } = dataSendTxs;

  const itemRows = useMemo(() => {
    if (data) {
      return data.map((item) => {
        const key = uuidv4();

        const { memo } = item.tx.body;
        let isReceive = false;

        const typeTx = item.tx.body.messages[0]['@type'];
        if (
          typeTx.includes('MsgSend') &&
          item.tx.body.messages[0].to_address === accountUser?.bech32
        ) {
          isReceive = true;
        }

        return (
          <Link
            to={`/network/bostrom/tx/${item.txhash}`}
            key={`${item.txhash}_${key}`}
          >
            <Display
              sideSaber={isReceive ? 'left' : 'right'}
              color={item.code === 0 ? Colors.BLUE : Colors.RED}
            >
              <div className={styles.containerDataItem}>
                <Memo memo={memo} receive={isReceive} />
                <div className={styles.containerAmountTime}>
                  <AmountDenomColor
                    receive={isReceive}
                    coins={item.tx.body.messages[0].amount}
                  />
                  <CreatedAt timeAt={item.timestamp} />
                </div>
              </div>
            </Display>
          </Link>
        );
      });
    }

    return [];
  }, [data, accountUser]);

  const fetchNextPageFnc = () => {
    setTimeout(() => {
      fetchNextPage();
    }, 250);
  };

  return (
    <InfiniteScroll
      dataLength={Object.keys(itemRows).length}
      next={fetchNextPageFnc}
      style={{ display: 'grid', gap: '15px', marginTop: '20px' }}
      hasMore={hasNextPage}
      loader={false}
    >
      {itemRows.length > 0 && itemRows}
    </InfiniteScroll>
  );
}

export default DataSendTxs;
