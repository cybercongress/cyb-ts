import { MilkdownProvider } from '@milkdown/react';
import MilkdownEditor, {
  MilkdownProps,
} from './components/MilkdownEditor/MilkdownEditor';
import ControlPanel from './components/ControlPanel/ControlPanel';
import styles from './Editor.module.scss';
import Display from '../containerGradient/Display/Display';

function Editor({ milkdownRef, content, onChange }: MilkdownProps) {
  return (
    <Display isVertical color="purple" sideSaber="right">
      <MilkdownProvider>
        <div className={styles.wraper}>
          <ControlPanel />
          <div className={styles.containerEditor}>
            <div></div>
            <MilkdownEditor
              milkdownRef={milkdownRef}
              content={content}
              onChange={onChange}
            />
            <div></div>
          </div>
        </div>
      </MilkdownProvider>
    </Display>
  );
}

export default Editor;
