import { useCallback, useRef } from 'react';
import { Display, DisplayTitle, MainContainer } from 'src/components';
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
    onChangeCurrentMarkdown,
  } = useStudioContext();

  const onMilkdownChange = useCallback(
    (markdown: string) => {
      onChangeCurrentMarkdown(markdown);
    },
    [onChangeCurrentMarkdown]
  );

  return (
    <>
      <MainContainer>
        <Display
          color="purple"
          noPadding
          title={<DisplayTitle title={<ControlPanel />} />}
        >
          <div className={styles.wrapper}>
            <div className={styles.containerEditor}>
              <Keywords
                type="from"
                items={keywordsFrom}
                onClickAddBtn={() => setStateActionBar('keywords-from')}
              />
              <MilkdownEditor
                milkdownRef={milkdownRef}
                content={loadedMarkdown}
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
      </MainContainer>
      <ActionBarContainer />
    </>
  );
}

export default Studio;
