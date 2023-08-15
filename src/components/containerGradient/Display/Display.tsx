import React from 'react';
import cx from 'classnames';
import styles from './Display.module.scss';
import DisplayTitle from '../DisplayTitle/DisplayTitle';
import { ColorLamp, Colors } from '../types';

type Props = {
  children: React.ReactNode;

  // deprecated
  // status?: ColorLamp;

  color?: ColorLamp;
  title: React.ReactElement<typeof DisplayTitle>;
  isVertical?: boolean;
};

function Display({
  children,
  isVertical,
  title,
  color = Colors.GREEN,
  ...props
}: Props) {
  const colorTemp = color || props.status;

  return (
    <div
      className={cx(styles.wrapper, styles[colorTemp], {
        [styles.vertical]: isVertical,
      })}
    >
      {title && (
        <header className={styles.header}>
          {React.cloneElement(title, { inDisplay: true })}
        </header>
      )}

      {children}
    </div>
  );
}

export default Display;
