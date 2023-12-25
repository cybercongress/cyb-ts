import React, { useEffect, useState } from 'react';
import { Account } from 'src/components';
import { useBackend } from 'src/contexts/backend';

import styles from './NotificationList.module.scss';
import Display from 'src/components/containerGradient/Display/Display';
import NItem from './NItem/NItem';
import { useQuery } from '@tanstack/react-query';
import Loader2 from 'src/components/ui/Loader2';
import cx from 'classnames';

type Props = {
  select: (id: string) => void;
};

function NotificationList({ select, selected }: Props) {
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
              ({ id, value, unreadCount, timestampUpdate, type }) => {
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
                        unreadCount={unreadCount}
                        value={type}
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
