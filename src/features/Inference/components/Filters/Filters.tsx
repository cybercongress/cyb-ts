import ButtonsGroup from 'src/components/buttons/ButtonsGroup/ButtonsGroup';
import AdviserHoverWrapper from 'src/features/adviser/AdviserHoverWrapper/AdviserHoverWrapper';
import { SortBy } from '../../type';
import styles from './Filters.module.scss';

const sortConfig = {
  [SortBy.rank]: {
    label: '⭐',
    tooltip: 'sort particles by cyberrank',
  },
  [SortBy.inference]: {
    label: '🔥',
    tooltip: 'sort particles by inference',
  },
  [SortBy.balance]: {
    label: '⚡️',
    tooltip: 'sort particles by balance of volt',
  },
};

type Props = {
  filter: SortBy;
  setFilter: (item: SortBy) => void;
  total?: number;
};

function Filters({ filter, setFilter, total }: Props) {
  return (
    <header className={styles.header}>
      <ButtonsGroup
        type="radio"
        items={Object.values(SortBy).map((sortType) => {
          return {
            label: sortConfig[sortType].label,
            name: sortType,
            checked: filter === sortType,
            tooltip: sortConfig[sortType].tooltip,
          };
        })}
        onChange={(sortType: SortBy) => {
          setFilter(sortType);
        }}
      />

      {total && (
        <AdviserHoverWrapper adviserContent="total particles in result">
          <div className={styles.total}>
            <span>{total}</span> particles
          </div>
        </AdviserHoverWrapper>
      )}
    </header>
  );
}

export default Filters;
