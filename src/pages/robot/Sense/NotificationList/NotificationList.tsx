import React, { useEffect, useState } from 'react';
import { Account } from 'src/components';
import { useBackend } from 'src/contexts/backend';

import styles from './NotificationList.module.scss';
import Display from 'src/components/containerGradient/Display/Display';
import NItem from './NItem/NItem';
import { useQuery } from '@tanstack/react-query';
import Loader2 from 'src/components/ui/Loader2';
import cx from 'classnames';
import { CoinAmount } from '../Area/Message/Message';

type Props = {
  select: (id: string) => void;
};

function NotificationList({ select, selected, setLoading }: Props) {
  const { senseApi } = useBackend();

  const getListQuery = useQuery({
    queryKey: ['senseApi', 'getList'],
    queryFn: async () => {
      return senseApi!.getList();
    },
    enabled: !!senseApi,
  });

  const getSummaryQuery = useQuery({
    queryKey: ['senseApi', 'getSummary'],
    queryFn: async () => {
      return senseApi!.getSummary();
    },
    enabled: !!senseApi,
  });

  useEffect(() => {
    if (getListQuery.isLoading || getSummaryQuery.isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [getListQuery.isLoading, getSummaryQuery.isLoading, setLoading]);

  // useEffect(() => {
  //   if (!selected) {
  //     return;
  //   }

  //   getListQuery.refetch();
  //   getSummaryQuery.refetch();
  // }, [getListQuery, getSummaryQuery, selected]);

  console.log('----getListQuery', getListQuery.data);
  console.log('----getSummaryQuery', getSummaryQuery.data);

  // const isLoading = getListQuery.isLoading || getSummaryQuery.isLoading;

  return (
    <div className={styles.wrapper}>
      <Display noPaddingX>
        <ul>
          <li>
            <NItem
              value="all new"
              unreadCount={getSummaryQuery.data?.[0]?.unread}
            />
          </li>
          {getListQuery.isFetching ? (
            <Loader2 />
          ) : getListQuery.data ? (
            getListQuery.data.map(
              ({ id, value, unreadCount, timestampUpdate, type, meta }) => {
                let text = meta.id?.text || '-';
                // temp reset after select
                const unread = id === selected ? undefined : unreadCount;

                if (meta?.type === 'cosmos.bank.v1beta1.MsgSend') {
                  const {
                    value: { amount },
                  } = meta;

                  text = (
                    <CoinAmount
                      amount={amount[0].amount}
                      denom={amount[0].denom}
                    />
                  );
                }

                if (meta?.type === 'cosmos.bank.v1beta1.MsgMultiSend') {
                  text = 'MsgMultiSend TODO:';
                }

                return (
                  <li
                    key={id}
                    className={cx(styles.item, {
                      [styles.selected]: id === selected,
                    })}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        select(id);
                      }}
                    >
                      <NItem
                        address={id}
                        timestamp={timestampUpdate}
                        unreadCount={unread}
                        value={text}
                      />
                    </button>
                  </li>
                );
              }
            )
          ) : (
            'no data'
          )}
        </ul>
      </Display>
    </div>
  );
}

export default NotificationList;
