import { useEffect, useState } from 'react';
import { useBackend } from 'src/contexts/backend';

import styles from './SenseList.module.scss';
import Display from 'src/components/containerGradient/Display/Display';
import SenseListItem from './SenseListItem/SenseListItem';
import { useQuery } from '@tanstack/react-query';
import Loader2 from 'src/components/ui/Loader2';
import cx from 'classnames';
import { CoinAction, CoinAmount } from '../SenseViewer/Message/Message';
import SenseListFilters from './SenseListFilters/SenseListFilters';
import { Filters } from '../types';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { AdviserProps } from '../Sense';

type Props = {
  select: (id: string) => void;
  selected?: string;
  setLoading: (isLoading: boolean) => void;
} & AdviserProps;

const mapFilterWithEntryType = {
  [EntryType.transactions]: Filters.Neuron,
  [EntryType.chat]: Filters.Neuron,
  [EntryType.particle]: Filters.Particle,
};

export const REFETCH_INTERVAL = 1000 * 20;

function SenseList({ select, selected, adviser }: Props) {
  const [filter, setFilter] = useState(Filters.All);
  const address = useAppSelector(selectCurrentAddress);

  const { senseApi } = useBackend();

  const enabled = Boolean(senseApi && address);

  const { error, data, isLoading, refetch } = useQuery({
    queryKey: ['senseApi', 'getList', address],
    queryFn: async () => {
      return senseApi!.getList();
    },
    enabled,
    refetchInterval: REFETCH_INTERVAL,
  });

  useEffect(() => {
    adviser.setLoading(isLoading);
  }, [isLoading, adviser]);

  useEffect(() => {
    adviser.setError(error?.message || '');
  }, [error, adviser]);

  useEffect(() => {
    if (!selected) {
      return;
    }

    setTimeout(() => {
      refetch();
    }, 300);
  }, [refetch, selected]);

  console.log('----getListQuery', data);

  let items = data || [];

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
                  let isAmountSend = false;

                  switch (entryType) {
                    case EntryType.particle:
                      text = meta.id?.text;
                      break;
                    case EntryType.chat:
                      text = meta.memo;
                      amount = meta.amount;
                      isAmountSend = meta.direction === 'to';
                      break;

                    case EntryType.transactions:
                      text = meta.memo;

                      if (meta.type === 'cosmos.bank.v1beta1.MsgMultiSend') {
                        amount = meta.value.outputs.find(
                          (output) => output.address === id
                        )?.coins;
                        break;
                      }

                      amount = meta.value.amount;
                      isAmountSend = meta.value.from_address === address;
                      break;

                    default:
                      break;
                  }

                  const content = (
                    <>
                      <span>{text}</span>
                      {amount?.map((a) => {
                        return (
                          <CoinAmount
                            amount={a.amount}
                            denom={a.denom}
                            type={
                              isAmountSend
                                ? CoinAction.send
                                : CoinAction.receive
                            }
                          />
                        );
                      })}
                    </>
                  );

                  const withAmount = Boolean(amount?.length);

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
                          withAmount
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
