import React from 'react';
import cx from 'classnames';
import styles from './Pill.module.scss';

export type Props = {
  text: string | React.ReactNode;
  color?: 'white' | 'black' | 'blue' | 'red' | 'green';
  image?: React.ReactNode;
  className?: string;
};

function Pill({ color = 'black', text, image, className }: Props) {
  return (
    <div
      className={cx(styles.pill, className, styles[color], {
        [styles['--withImage']]: image,
      })}
    >
      {image}
      {text}
    </div>
  );
}

export default Pill;
