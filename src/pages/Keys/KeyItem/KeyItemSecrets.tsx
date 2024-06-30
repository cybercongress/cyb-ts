import Pill from 'src/components/Pill/Pill';
import styles from './KeyItem.module.scss';

import cx from 'classnames';

import { useState } from 'react';
import { JsonRecord } from 'src/utils/localStorage';

type Props = {
  name: string;
  value: JsonRecord[keyof JsonRecord];
  selected: boolean;
  selectKey: (name: string) => void;
};

function KeyItemSecrets({ name, value, selected, selectKey }: Props) {
  const [showValue, setShowValue] = useState(false);
  return (
    <div
      className={cx(styles.wrapper, {
        [styles.selected]: selected,
      })}
      onClick={() => selectKey(name)}
    >
      <div className={styles.imageWrapper}>
        <img src={require('./images/secrets.png')} alt="" />

        <Pill text="secret" color="blue" className={styles.active} />
      </div>

      <div className={styles.content}>
        secret <Pill color="white" text={name || 'noname'} /> <br />
        contains value{' '}
        <span
          className={styles.pointer}
          onClick={() => setShowValue(!showValue)}
        >
          <Pill text={!showValue ? '******' : value} />
        </span>
        <br />
      </div>
    </div>
  );
}

export default KeyItemSecrets;
