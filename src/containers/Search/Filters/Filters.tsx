import React from 'react';
import styles from './Filters.module.scss';
import ButtonsGroup from 'src/components/buttons/ButtonsGroup/ButtonsGroup';
import { LinksTypeFilter, SortBy } from '../types';
import { initialContentTypeFilterState } from '../SearchResults';
import Links from 'src/components/search/Spark/Meta/Links/Links';
import { Tooltip } from 'src/components';

// TODO: move to ipfs config, global
export const contentTypeConfig = {
  text: {
    label: '📄',
    tooltip: 'show only articles with text',
  },
  image: {
    label: '🖼️',
    tooltip: 'show only images',
  },
  video: {
    label: '🎞️',
    tooltip: 'show only video content',
  },
  pdf: {
    label: '📑',
    tooltip: 'show only pdf files',
  },
  link: {
    label: '🔗',
    tooltip: 'show only particles with links',
  },
  audio: {
    label: '🎧',
    tooltip: 'show only audio content',
  },
};

const sortConfig = {
  [SortBy.rank]: {
    label: '⭐',
    tooltip: 'sort particles by cyberrank',
  },
  [SortBy.date]: {
    label: '📅',
    tooltip: 'sort particles by date of creation',
  },
  [SortBy.popular]: {
    label: '🔥',
    tooltip: '',
  },
  [SortBy.mine]: {
    label: '👤',
    tooltip: '',
  },
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
                  label: contentTypeConfig[filter].label,
                  name: filter,
                  checked: filters[filter],
                  tooltip: contentTypeConfig[filter].tooltip,
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
            label: sortConfig[sortType].label,
            disabled: sortType === SortBy.mine || sortType === SortBy.popular,
            name: sortType,
            checked: filter2 === sortType,
            tooltip: sortConfig[sortType].tooltip,
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

      <Tooltip tooltip="total particles in result" placement="bottom">
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
