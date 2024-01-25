import { useState } from 'react';

import styles from './SenseList.module.scss';
import Display from 'src/components/containerGradient/Display/Display';
import Loader2 from 'src/components/ui/Loader2';
import cx from 'classnames';
import SenseListFilters from './SenseListFilters/SenseListFilters';
import { Filters } from '../types';
import { AdviserProps } from '../Sense';
import SenseListItemContainer from './SenseListItem/SenseListItem.container';
import { useAppSelector } from 'src/redux/hooks';
import { useBackend } from 'src/contexts/backend';
import { isParticle } from 'src/features/particle/utils';

type Props = {
  select: (id: string) => void;
  selected?: string;
} & AdviserProps;

function SenseList({ select, selected }: Props) {
  const [filter, setFilter] = useState(Filters.All);

  const senseList = useAppSelector((store) => store.sense.list);
  const { senseApi } = useBackend();

  const apiLoading = !senseApi;

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

  console.log(items);

  return (
    <div className={styles.wrapper}>
      <Display noPaddingX>
        {apiLoading || senseList.isLoading ? (
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
                // .slice(0, 4)
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
                        <SenseListItemContainer senseItemId={id} />
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
