import type { CmdKey } from '@milkdown/core';
import { callCommand } from '@milkdown/utils';
import { useInstance } from '@milkdown/react';
import {
  toggleEmphasisCommand,
  toggleStrongCommand,
} from '@milkdown/preset-commonmark';
import styles from './ControlPanel.module.scss';
import Button from '../../btnGrd';
import { toggleLinkCommand } from '../Editor';

function ControlPanel() {
  const [loading, get] = useInstance();

  function call<T>(command: CmdKey<T>, payload?: T) {
    return get()?.action(callCommand(command, payload));
  }

  return (
    <div className={styles.containerControlPanel}>
      <Button onClick={() => call(toggleEmphasisCommand.key)}>italic</Button>
      {/* <Button onClick={() => call(toggleLinkCommand.key)}>cyberlink</Button> */}
    </div>
  );
}

export default ControlPanel;
