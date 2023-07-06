import { UseInfiniteQueryResult } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getNowUtcTime, timeSince } from 'src/utils/utils';
import { ContainerGradientText, Dots } from 'src/components';
import { AccountValue } from 'src/types/defaultAccount';
import { Nullable, Option } from 'src/types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AmountDenom } from 'src/containers/txs/Activites';
import { Link } from 'react-router-dom';
import { TxBody } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { TxsResponse } from '@cosmjs/launchpad';
import {
  ContainerGradientBeforeOrAfter,
  ContainerLampAfter,
  ContainerLampBefore,
} from 'src/components/containerGradient/ContainerGradient';

type TxsResponseCustom = {
  code: number;
  height: string;
  txhash: string;
  timestamp: string;
  tx: {
    '@type': string;
    body: TxBody;
  };
};

type DataSendTxs = {
  data: Option<TxsResponseCustom[]>;
  fetchNextPage: () => void;
  hasNextPage: boolean;
};

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
        let timeAgoInMS = null;
        const { memo } = item.tx.body;
        const time = getNowUtcTime() - Date.parse(item.timestamp);
        if (time > 0) {
          timeAgoInMS = time;
        }

        let typeTx = item.tx.body.messages[0]['@type'];
        if (
          typeTx.includes('MsgSend') &&
          item.tx.body.messages[0].to_address === accountUser?.bech32
        ) {
          typeTx = 'Receive';
        }

        return (
          <Link
            to={`/network/bostrom/tx/${item.txhash}`}
            key={`${item.txhash}_${key}`}
          >
            <ContainerGradientBeforeOrAfter
              type={typeTx === 'Receive' ? 'before' : 'after'}
              status={item.code === 0 ? 'blue' : 'red'}
              userStyleContent={{ display: 'grid', gap: '10px' }}
            >
              <div
                style={{
                  color: '#fff',
                  paddingLeft: typeTx === 'Receive' ? '0px' : '50px',
                }}
              >
                {memo}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    color: typeTx === 'Receive' ? '#76FF03' : '#FF5C00',
                  }}
                >
                  {item.tx.body.messages[0].amount.map((item, i) => {
                    return (
                      <AmountDenom
                        denom={item.denom}
                        amountValue={item.amount}
                        key={i}
                      />
                    );
                  })}
                </div>
                <div
                  style={{
                    color: '#777',
                  }}
                >
                  {timeSince(timeAgoInMS)} ago
                </div>
              </div>
            </ContainerGradientBeforeOrAfter>
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
      {itemRows.length > 0 ? itemRows : null}
    </InfiniteScroll>
  );
}

export default DataSendTxs;
