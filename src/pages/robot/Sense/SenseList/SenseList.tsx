import { useEffect, useState } from 'react';
import { useBackend } from 'src/contexts/backend';

import styles from './SenseList.module.scss';
import Display from 'src/components/containerGradient/Display/Display';
import SenseListItem from './SenseListItem/SenseListItem';
import { useQuery } from '@tanstack/react-query';
import Loader2 from 'src/components/ui/Loader2';
import cx from 'classnames';
import { CoinAmount } from '../SenseViewer/Message/Message';
import SenseListFilters from './SenseListFilters/SenseListFilters';
import { Filters } from '../types';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentAddress } from 'src/redux/features/pocket';

type Props = {
  select: (id: string) => void;
  selected?: string;
  setLoading: (isLoading: boolean) => void;
};

const mapFilterWithEntryType = {
  [EntryType.transactions]: Filters.Neuron,
  [EntryType.chat]: Filters.Neuron,
  [EntryType.particle]: Filters.Particle,
};

const REFETCH_INTERVAL = 1000 * 20;

function SenseList({ select, selected, setLoading }: Props) {
  const [filter, setFilter] = useState(Filters.All);
  const address = useAppSelector(selectCurrentAddress);

  const { senseApi } = useBackend();

  const enabled = !!(senseApi && address);

  const getSummaryQuery = useQuery({
    queryKey: ['senseApi', 'getSummary', address],
    queryFn: async () => {
      return senseApi!.getSummary(address!);
    },
    enabled,
    refetchInterval: REFETCH_INTERVAL,
  });

  const getListQuery = useQuery({
    queryKey: ['senseApi', 'getList', address],
    queryFn: async () => {
      return senseApi!.getList(address!);
    },
    enabled,
    refetchInterval: REFETCH_INTERVAL,
  });

  const isLoading = getListQuery.isLoading || getSummaryQuery.isLoading;

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (!selected) {
      return;
    }

    getListQuery.refetch();
    getSummaryQuery.refetch();
  }, [getListQuery, getSummaryQuery, selected]);

  console.log('----getListQuery', getListQuery.data);
  console.log('----getSummaryQuery', getSummaryQuery.data);

  let items = getListQuery.data || [];

  if (filter !== Filters.All) {
    items = items.filter((item) => {
      return mapFilterWithEntryType[item.entryType] === filter;
    });
  }

  return (
    <div className={styles.wrapper}>
      <Display noPaddingX>
        {isLoading ? (
          <div className={styles.center}>
            <Loader2 />
          </div>
        ) : items.length ? (
          <aside>
            <SenseListItem
              value="all"
              unreadCount={getSummaryQuery.data?.[0]?.unread || 0}
            />

            <div className={styles.filters}>
              <SenseListFilters
                selected={filter}
                onChangeFilter={(filter: Filters) => setFilter(filter)}
              />
            </div>

            <ul>
              {items.map(
                ({ id, entryType, meta, timestampUpdate, unreadCount }) => {
                  let text;
                  let amount;
                  switch (entryType) {
                    case EntryType.particle:
                      text = meta.id?.text;
                      break;
                    case EntryType.chat:
                      text = meta.memo;
                      amount = meta.amount;
                      break;

                    case EntryType.transactions:
                      if (meta.type === 'cosmos.bank.v1beta1.MsgMultiSend') {
                        text = 'MultiSend TODO:';
                        break;
                      }

                      text = meta.memo;
                      amount = meta.value.amount;
                      break;

                    default:
                      break;
                  }

                  const content = (
                    <>
                      {text}
                      {amount?.map((a) => {
                        return <CoinAmount amount={a.amount} denom={a.denom} />;
                      })}
                    </>
                  );

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
                        <SenseListItem
                          address={id}
                          timestamp={timestampUpdate}
                          unreadCount={unreadCount}
                          value={content}
                        />
                      </button>
                    </li>
                  );
                }
              )}
            </ul>
          </aside>
        ) : (
          <div className={styles.center}>no data</div>
        )}
      </Display>
    </div>
  );
}

export default SenseList;
