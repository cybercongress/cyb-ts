import { useState } from 'react';

import styles from './SenseList.module.scss';
import Display from 'src/components/containerGradient/Display/Display';
import Loader2 from 'src/components/ui/Loader2';
import cx from 'classnames';
import SenseListFilters from './SenseListFilters/SenseListFilters';
import { Filters } from '../types';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { AdviserProps } from '../Sense';
import SenseListItemContainer from './SenseListItem/SenseListItem.container.tsx';
import { SenseListItem } from 'src/services/backend/types/sense';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { useBackend } from 'src/contexts/backend';

type Props = {
  select: (id: string) => void;
  selected?: string;
} & AdviserProps;

const mapFilterWithEntryType = {
  [EntryType.transactions]: Filters.Neuron,
  [EntryType.chat]: Filters.Neuron,
  [EntryType.particle]: Filters.Particle,
};

function SenseList({ select, selected }: Props) {
  const [filter, setFilter] = useState(Filters.All);

  const senseList = useAppSelector((store) => store.sense.list);
  const { senseApi } = useBackend();

  const apiLoading = !senseApi;

  let items = senseList.data || [];

  if (filter !== Filters.All) {
    items = items.filter((item) => {
      return mapFilterWithEntryType[item.entryType] === filter;
    });
  }

  return (
    <div className={styles.wrapper}>
      <Display noPaddingX>
        {senseList.isLoading || apiLoading ? (
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
              {items
                // .slice(0, 1)
                .map((id) => {
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
                        <SenseListItemContainer id={id} />
                      </button>
                    </li>
                  );
                })}
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
