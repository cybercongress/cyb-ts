import cx from 'classnames';
import Pill from 'src/components/Pill/Pill';
import arrowImg from 'images/arrow-left-img.svg';
import styles from './Keywords.module.scss';
import KeywordButton from '../KeywordButton/KeywordButton';
import { KeywordsItem } from '../../studio.context';

type Props = {
  items: KeywordsItem[];
  type: 'from' | 'to';
  onClickAddBtn: () => void;
};

function Keywords({ items, type, onClickAddBtn }: Props) {
  const renderItem = items.map((item, index) => {
    return (
      <Pill
        color="green-outline"
        text={item.text}
        key={index}
        className={styles.overflowPill}
      />
    );
  });

  return (
    <div className={styles.wrapper}>
      <div
        className={cx(styles.tagContainer, { [styles.reverse]: type === 'to' })}
      >
        # <img src={arrowImg} alt="arrow" />{' '}
      </div>
      <div className={styles.containerPill}>
        {renderItem}

        <KeywordButton
          text="+"
          onClick={onClickAddBtn}
          tooltip={`add keywords ${type}`}
        />
      </div>
    </div>
  );
}

export default Keywords;
