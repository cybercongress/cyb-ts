import { useState } from 'react';

import { useAppSelector } from 'src/redux/hooks';
import Display from 'src/components/containerGradient/Display/Display';
import Loader2 from 'src/components/ui/Loader2';
import cx from 'classnames';
import { isParticle } from 'src/features/particle/utils';
import styles from './SenseList.module.scss';
import SenseListFilters from './SenseListFilters/SenseListFilters';
import { Filters } from '../types';
import { AdviserProps } from '../Sense';
import SenseListItemContainer from './SenseListItem/SenseListItem.container';

type Props = {
  select: (id: string) => void;
  selected?: string;
} & AdviserProps;

function SenseList({ select, selected, setFilter: setFilterParent }: Props) {
  const [filter, setFilter] = useState(Filters.All);

  const senseList = useAppSelector((store) => store.sense.list);

  let items = senseList.data || [];

  if (filter !== Filters.All) {
    items = items.filter((item) => {
      const particle = isParticle(item);

      return (
        particle === (filter === Filters.Particle) ||
        !particle === (filter === Filters.Neuron)
      );
    });
  }

  if (filter === Filters.LLM) {
    items = [];
  }

  function getFilterText(filter: Filters) {
    switch (filter) {
      case Filters.Neuron:
        return 'neuron';

      case Filters.Particle:
        return 'particle';

      default:
        return '';
    }
  }

  return (
    <div className={styles.wrapper}>
      <Display noPadding>
        <div className={styles.filters}>
          <SenseListFilters
            selected={filter}
            onChangeFilter={(filter: Filters) => {
              setFilter(filter);
              setFilterParent(filter === Filters.LLM);
            }}
          />
        </div>

        {senseList.isLoading && !(items.length > 0) ? (
          <div className={styles.center}>
            <Loader2 />
          </div>
        ) : items.length ? (
          <ul>
            {items.map((id) => {
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
                    <SenseListItemContainer
                      senseItemId={id}
                      currentChatId={selected}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className={styles.center}>no {getFilterText(filter)} chats</p>
        )}
      </Display>
    </div>
  );
}

export default SenseList;
