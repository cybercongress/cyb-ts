import React from 'react';
import cx from 'classnames';
import styles from './Pill.module.scss';

export enum Colors {
  white = 'white',
  black = 'black',
  blue = 'blue',
  red = 'red',
  green = 'green',
}

export type Props = {
  text: string | React.ReactNode;
  color?: Colors;
  image?: React.ReactNode;
};

function Pill({ color = Colors.black, text, image }: Props) {
  return (
    <div
      className={cx(styles.pill, styles[color], {
        [styles['--withImage']]: image,
      })}
    >
      {image}
      {text}
    </div>
  );
}

export default Pill;