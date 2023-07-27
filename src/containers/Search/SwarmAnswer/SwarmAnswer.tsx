import type { ScriptMyParticleResult } from 'src/types/scripting';
import { isCID } from 'src/utils/ipfs/helpers';
import ContentItem from 'src/components/ContentItem/contentItem';
import styles from './SwarmAnswer.module.scss';

const dummyItem = {
  rank: 999,
};
function SwarmAnswer({
  item,
  query,
  nickname,
}: {
  item: ScriptMyParticleResult;
  query: string;
  nickname: string;
}) {
  const { answer, action } = item;
  const isCid = answer && isCID(answer);
  const hasError = action === 'error';
  return (
    <div className={styles.swarmAnswer}>
      {hasError && <div>{`🤯 ${answer}`}</div>}
      {!hasError && (
        <>
          {isCid && (
            <ContentItem cid={answer} item={dummyItem} parent={query} />
          )}
          {!isCid && <div>{answer}</div>}
        </>
      )}
      <div className={styles.nickname}>{nickname}</div>
    </div>
  );
}

export default SwarmAnswer;
