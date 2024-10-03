import { useState } from 'react';

import { useAppSelector, useAppDispatch } from 'src/redux/hooks';
import Display from 'src/components/containerGradient/Display/Display';
import Loader2 from 'src/components/ui/Loader2';
import cx from 'classnames';
import { isParticle } from 'src/features/particle/utils';
import styles from './SenseList.module.scss';
import SenseListFilters from './SenseListFilters/SenseListFilters';
import { Filters } from '../types';
import { AdviserProps } from '../Sense';
import SenseListItemContainer from './SenseListItem/SenseListItem.container';
import { selectLLMThread, createLLMThread } from 'src/features/sense/redux/sense.redux';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  select: (id: string) => void;
  selected?: string;
  setFilter: (isLLMFilter: boolean) => void;
} & AdviserProps;

function SenseList({ select, selected, setFilter }: Props) {
  const [filter, updateFilter] = useState(Filters.All);
  const dispatch = useAppDispatch();
  const llmThreads = useAppSelector((state) => state.sense.llm.threads);

  const senseList = useAppSelector((store) => store.sense.list);

  let items = senseList.data || [];

  if (filter !== Filters.All) {
    items = items.filter((item) => {
      if (filter === Filters.LLM) {
        return llmThreads.some(thread => thread.id === item);
      }
      const particle = isParticle(item);
      return (
        particle === (filter === Filters.Particle) ||
        !particle === (filter === Filters.Neuron)
      );
    });
  }

  if (filter === Filters.LLM) {
    items = llmThreads.map((thread) => thread.id);
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

  const handleNewThread = () => {
    const newThreadId = uuidv4();
    dispatch(createLLMThread({ id: newThreadId }));
    dispatch(selectLLMThread({ id: newThreadId }));
    select(newThreadId);
    setFilter(true);
  };

  return (
    <div className={styles.wrapper}>
      <Display noPadding>
        <div className={styles.filters}>
          <SenseListFilters
            selected={filter}
            onChangeFilter={(filter: Filters) => {
              updateFilter(filter);
              setFilter(filter === Filters.LLM);

              // Select LLM chat when LLM filter is selected
              if (filter === Filters.LLM) {
                select('llm');
              }
            }}
          />
          {filter === Filters.LLM && (
            <button onClick={handleNewThread} className={styles.newThreadButton}>
              New Thread
            </button>
          )}
        </div>

        {filter === Filters.LLM ? (
          <ul>
            {llmThreads.map((thread) => (
              <li
                key={thread.id}
                className={cx(styles.item, {
                  [styles.selected]: selected === thread.id,
                })}
              >
                <button
                  type="button"
                  onClick={() => {
                    select(thread.id);
                    dispatch(selectLLMThread({ id: thread.id }));
                  }}
                >
                  <div className={styles.llmChatItem}>
                    <span>{thread.title || `Conversation ${thread.id}`}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : senseList.isLoading && !(items.length > 0) ? (
          <div className={styles.center}>
            <Loader2 />
          </div>
        ) : items.length ? (
          <ul>
            {items.map((id) => (
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
                    currentChatId={selected} // **Ensured currentChatId was passed**
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.center}>no {getFilterText(filter)} chats</p>
        )}
      </Display>
    </div>
  );
}

export default SenseList;
