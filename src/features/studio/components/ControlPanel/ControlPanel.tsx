import type { CmdKey } from '@milkdown/core';
import { callCommand } from '@milkdown/utils';
import { useInstance } from '@milkdown/react';
import ButtonsGroup from 'src/components/buttons/ButtonsGroup/ButtonsGroup';
import Links from 'src/components/search/Spark/Meta/Links/Links';
import { formatCurrency } from 'src/utils/utils';
import { PREFIXES } from 'src/containers/ipfs/components/metaInfo';
import styles from './ControlPanel.module.scss';
import { useStudioContext } from '../../studio.context';
import HistoryCommand from '../HistoryCommand/HistoryCommand';

const contentTypeConfig = {
  neuron: {
    label: '@',
    tooltip: '',
  },
  token: {
    label: '$',
    tooltip: '',
  },
  link: {
    label: '~',
    tooltip: '',
  },
  particle: {
    label: '#',
    tooltip: '',
  },
  code: {
    label: '!',
    tooltip: '',
  },
};

function ControlPanel() {
  const { keywordsFrom, keywordsTo, currentMarkdown } = useStudioContext();
  const [loading, get] = useInstance();

  function call<T>(command: CmdKey<T>, payload?: T) {
    return get()?.action(callCommand(command, payload));
  }

  return (
    // <Display isVertical color="blue" sideSaber="left">
    <div className={styles.containerControlPanel}>
      <ButtonsGroup
        type="checkbox"
        onChange={() => {}}
        items={Object.values(contentTypeConfig).map((type) => {
          return {
            label: type.label,
            name: type.label,
            checked: type === '',
            tooltip: type.tooltip,
          };
        })}
      />
      <Links
        to={keywordsFrom.length}
        from={keywordsTo.length}
        onChange={() => {}}
      />
      <span className={styles.size}>
        🟥 {formatCurrency(currentMarkdown.length, 'B', 0, PREFIXES)}
      </span>
      <HistoryCommand call={call} />
    </div>
    // </Display>
  );
}

export default ControlPanel;
