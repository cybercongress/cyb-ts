import React from 'react';
import styles from './Filters.module.scss';
import ButtonsGroup from 'src/components/buttons/ButtonsGroup/ButtonsGroup';
import { LinksTypeFilter, SortBy } from '../types';
import { initialContentTypeFilterState } from '../SearchResults';
import Links from 'src/components/search/Spark/Meta/Links/Links';

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
}) {
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
        backlinks={total.to}
        outcoming={total.from}
        value={linksFilter}
        onChange={(val: LinksTypeFilter) => {
          setLinksFilter(val);
        }}
      />

      <div className={styles.total}>
        <span>{total2}</span> particles
      </div>
    </header>
  );
}

export default Filters;
