import type { CmdKey } from '@milkdown/core';
import { callCommand } from '@milkdown/utils';
import { useInstance } from '@milkdown/react';
import { toggleEmphasisCommand } from '@milkdown/preset-commonmark';
import Display from 'src/components/containerGradient/Display/Display';
import ButtonsGroup from 'src/components/buttons/ButtonsGroup/ButtonsGroup';
import styles from './ControlPanel.module.scss';

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
  const [loading, get] = useInstance();

  function call<T>(command: CmdKey<T>, payload?: T) {
    return get()?.action(callCommand(command, payload));
  }

  return (
    <Display isVertical color="blue" sideSaber="left">
      <div className={styles.containerControlPanel}>
        <ButtonsGroup
          type="checkbox"
          items={Object.values(contentTypeConfig).map((type) => {
            return {
              label: type.label,
              name: type.label,
              checked: type === '',
              tooltip: type.tooltip,
            };
          })}
        />
        {/* <Button onClick={() => call(toggleEmphasisCommand.key)}>italic</Button> */}
        {/* <Button onClick={() => call(toggleLinkCommand.key)}>cyberlink</Button> */}
      </div>
    </Display>
  );
}

export default ControlPanel;
