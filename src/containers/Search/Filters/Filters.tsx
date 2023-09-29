import React from 'react';
import styles from './Filters.module.scss';
import ButtonsGroup from 'src/components/buttons/ButtonsGroup/ButtonsGroup';
import { LinksTypeFilter, SortBy } from '../types';
import { initialContentTypeFilterState } from '../SearchResults';
import Links from 'src/components/search/Spark/Meta/Links/Links';
import { Tooltip } from 'src/components';

const mapF = {
  text: '📄',
  image: '🖼️',
  video: '🎞️',
  pdf: '📑',
  link: '🔗',
  // audio: '🎧',
};

const mapS = {
  [SortBy.rank]: '⭐',
  [SortBy.date]: '📅',
  [SortBy.popular]: '🔥',
  [SortBy.mine]: '👤',
};

type Props = {
  linksFilter: LinksTypeFilter;
};

function Filters({
  filters,
  setFilters,
  filter2,
  setFilter2,
  linksFilter,
  setLinksFilter,
  total,
  total2,
  contentType,
}: Props) {
  return (
    <header className={styles.header}>
      <div>
        <ButtonsGroup
          type="checkbox"
          onChange={(filter: typeof initialContentTypeFilterState & 'all') => {
            if (filter === 'all') {
              setFilters(initialContentTypeFilterState);
              return;
            }

            setFilters((filters) => ({
              ...initialContentTypeFilterState,
              [filter]: !filters[filter],
            }));
          }}
          items={[
            {
              label: 'all',
              checked: !Object.values(filters).some((filter) => filter),
            },
          ].concat(
            Object.keys(filters)
              .map((filter) => {
                if (!Object.values(contentType).includes(filter)) {
                  return null;
                }

                return {
                  label: mapF[filter],
                  name: filter,
                  checked: filters[filter],
                };
              })
              .filter((item) => !!item)
          )}
        />
      </div>

      <ButtonsGroup
        type="radio"
        items={Object.values(SortBy).map((sortType) => {
          return {
            label: mapS[sortType],
            disabled: sortType === SortBy.mine || sortType === SortBy.popular,
            name: sortType,
            checked: filter2 === sortType,
          };
        })}
        onChange={(sortType: SortBy) => {
          setFilter2(sortType);
          localStorage.setItem('search-sort', sortType);
        }}
      />

      <Links
        to={total.to}
        from={total.from}
        value={linksFilter}
        onChange={(val: LinksTypeFilter) => {
          setLinksFilter(val);
        }}
      />

      <Tooltip tooltip="text for this" placement="bottom">
        <div className={styles.total}>
          <span>
            {(() => {
              switch (linksFilter) {
                case LinksTypeFilter.all:
                  return total.to + total.from;

                case LinksTypeFilter.to:
                  return total.to;

                case LinksTypeFilter.from:
                default:
                  return total.from;
              }
            })()}
          </span>{' '}
          particles
        </div>
      </Tooltip>
    </header>
  );
}

export default Filters;
