import type { ReactToInputResult } from 'src/services/scripting/engine';
import { isCID } from 'src/utils/ipfs/helpers';
import ContentItem from 'src/components/ContentItem/contentItem';
import styles from './SwarmAnswer.module.scss';

const dummyItem = {
  rank: 999,
};
function SwarmAnswer({
  item,
  query,
}: {
  item: ReactToInputResult;
  query: string;
}) {
  const { nickname, answer, action } = item;
  const isCid = answer && isCID(answer);

  return (
    <div className={styles.swarmAnswer}>
      {isCid && <ContentItem cid={answer} item={dummyItem} parent={query} />}
      {!isCid && <div>{answer}</div>}
      <div className={styles.nickname}>{nickname}</div>
    </div>
  );
}

export default SwarmAnswer;
