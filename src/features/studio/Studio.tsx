import { useRef } from 'react';
import { Display, MainContainer } from 'src/components';
import styles from './Studio.module.scss';
import Keywords from './components/Keywords/Keywords';
import MilkdownEditor, {
  MilkdownRef,
} from './components/Editor/MilkdownEditor';
import { useStudioContext } from './studio.context';
import ActionBarContainer from './ActionBar';
import ControlPanel from './components/ControlPanel/ControlPanel';

function Studio() {
  const milkdownRef = useRef<MilkdownRef>(null);
  const {
    loadedMarkdown,
    keywordsFrom,
    keywordsTo,
    setStateActionBar,
    saveMarkdown,
  } = useStudioContext();

  return (
    <>
      <MainContainer>
        <div className={styles.wrapper}>
          <ControlPanel />
          <div className={styles.containerEditor}>
            <Keywords
              type="from"
              items={keywordsFrom}
              onClickAddBtn={() => setStateActionBar('keywords-from')}
            />
            <Display color="blue">
              <MilkdownEditor
                milkdownRef={milkdownRef}
                content={loadedMarkdown}
                onChange={saveMarkdown}
              />
            </Display>
            <Keywords
              type="to"
              items={keywordsTo}
              onClickAddBtn={() => setStateActionBar('keywords-to')}
            />
          </div>
        </div>
      </MainContainer>
      <ActionBarContainer />
    </>
  );
}

export default Studio;
