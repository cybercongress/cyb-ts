import React, { useState } from 'react';
import styles from './Filters.module.scss';
import ButtonsGroup from 'src/components/buttons/ButtonsGroup/ButtonsGroup';
import { LinksTypeFilter, SortBy } from '../types';
import { initialContentTypeFilterState } from '../constants';
import Links from 'src/components/search/Spark/Meta/Links/Links';
import { Tooltip } from 'src/components';
import { AccountInput } from 'src/pages/teleport/components/Inputs';
import useCurrentAddress from 'src/features/cybernet/_move/useCurrentAddress';

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
  // [SortBy.popular]: {
  //   label: '🔥',
  //   tooltip: '',
  // },
  // [SortBy.mine]: {
  //   label: '👤',
  //   tooltip: '',
  // },
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
  contentType,
  neuron,
  setNeuron,
}: Props) {
  const [chooseNeuronOpen, setChooseNeuronOpen] = useState(!!neuron);

  console.log(neuron);

  const currentAddress = useCurrentAddress();

  return (
    <>
      <header className={styles.header}>
        <div>
          <ButtonsGroup
            type="checkbox"
            onChange={(
              filter: typeof initialContentTypeFilterState & 'all'
            ) => {
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
              disabled:
                // sortType === SortBy.mine ||
                // sortType === SortBy.popular ||
                sortType === SortBy.rank && neuron,
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

        <ButtonsGroup
          type="checkbox"
          items={[
            {
              label: '💇',
              name: 'me',
              checked: neuron === currentAddress,
              tooltip: 'show only particles from my neuron',
            },
            {
              label: '👤',
              name: 'neuron',
              checked:
                (!!neuron && neuron !== currentAddress) || chooseNeuronOpen,
              tooltip: 'show only particles from this neuron',
            },
          ]}
          onChange={(name) => {
            if (name === 'neuron') {
              setChooseNeuronOpen((item) => !item);
            }

            if (name !== 'neuron' && chooseNeuronOpen) {
              setChooseNeuronOpen(false);
            }

            if (name === 'me') {
              setNeuron(neuron === currentAddress ? null : currentAddress);
            }
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

      {chooseNeuronOpen && (
        <div className={styles.neuronFilter}>
          <AccountInput
            recipient={neuron}
            setRecipient={(v) => {
              if (v) {
                setChooseNeuronOpen(false);
              }

              setNeuron(v);
            }}
          />
        </div>
      )}
    </>
  );
}

export default Filters;
