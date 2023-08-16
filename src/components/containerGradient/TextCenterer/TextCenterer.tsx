import React from 'react';
import styles from './TextCenterer.module.scss';
import cx from 'classnames';

type Props = {
  text: string;
};

function TextCenterer({ text }: Props) {
  const { length } = text;

  return (
    <div
      className={cx(styles.wrapper, {
        [styles.center]: length <= 64,
        [styles.title]: length <= 16,
      })}
    >
      {text}
    </div>
  );
}

export default TextCenterer;
