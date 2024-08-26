import { useCallback, useRef } from 'react';
// import { MilkdownProvider } from '@milkdown/react';
import { Display, MainContainer } from 'src/components';

import { MilkdownProvider } from '@milkdown/react';
import styles from './Studio.module.scss';
import Keywords from './components/Keywords/Keywords';
import MilkdownEditor, {
  MilkdownRef,
} from './components/Editor/MilkdownEditor';
import { markdown } from './testData';
import { useStudioContext } from './studio.context';
import ActionBarContainer from './ActionBar';
import ControlPanel from './components/ControlPanel/ControlPanel';

function Studio() {
  const {
    keywordsFrom,
    keywordsTo,
    setStateActionBar,
    onChangeCurrentMarkdown,
  } = useStudioContext();
  const milkdownRef = useRef<MilkdownRef>(null);

  const onMilkdownChange = useCallback(
    (markdown: string) => {
      console.log('markdown', markdown);
      onChangeCurrentMarkdown(markdown);
    },
    [onChangeCurrentMarkdown]
  );

  return (
    <>
      <MainContainer>
        <MilkdownProvider>
          <Display isVertical color="purple" sideSaber="right" noPadding>
            <div className={styles.wrapper}>
              <ControlPanel />
              <div className={styles.containerEditor}>
                <Keywords
                  type="from"
                  items={keywordsFrom}
                  onClickAddBtn={() => setStateActionBar('keywords-from')}
                />
                <MilkdownEditor
                  milkdownRef={milkdownRef}
                  content={markdown}
                  onChange={onMilkdownChange}
                />
                <Keywords
                  type="to"
                  items={keywordsTo}
                  onClickAddBtn={() => setStateActionBar('keywords-to')}
                />
              </div>
            </div>
          </Display>
        </MilkdownProvider>
      </MainContainer>
      <ActionBarContainer />
    </>
  );
}

export default Studio;
