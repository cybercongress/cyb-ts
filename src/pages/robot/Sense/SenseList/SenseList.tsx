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

type Props = {
  select: (id: string) => void;
  selected?: string;
  senseList: {
    data: SenseListItem[] | undefined;
    isLoading: boolean;
  };
} & AdviserProps;

const mapFilterWithEntryType = {
  [EntryType.transactions]: Filters.Neuron,
  [EntryType.chat]: Filters.Neuron,
  [EntryType.particle]: Filters.Particle,
};

function SenseList({ select, selected, senseList }: Props) {
  const [filter, setFilter] = useState(Filters.All);

  let items = senseList.data || [];

  if (filter !== Filters.All) {
    items = items.filter((item) => {
      return mapFilterWithEntryType[item.entryType] === filter;
    });
  }

  console.log('----senseListItems', items);

  return (
    <div className={styles.wrapper}>
      <Display noPaddingX>
        {senseList.isLoading ? (
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
                .map((senseListItem) => {
                  const { id } = senseListItem;

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
                        <SenseListItemContainer senseListItem={senseListItem} />
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
