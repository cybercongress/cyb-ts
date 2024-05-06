import React from 'react';
import cx from 'classnames';
import styles from './Display.module.scss';
import DisplayTitle from '../DisplayTitle/DisplayTitle';
import { ColorLamp, Colors } from '../types';

type Props = {
  children: React.ReactNode;

  /**
   * @deprecated use color props
   */
  status?: ColorLamp;

  noPaddingX?: boolean;

  sideSaber?: 'left' | 'right';

  color?: ColorLamp;
  title?: React.ReactElement<typeof DisplayTitle>;
  isVertical?: boolean;
};

function Display({
  children,
  isVertical,
  title,
  noPaddingX,
  sideSaber,
  color = Colors.GREEN,
  status,
}: Props) {
  const colorTemp = color || status;

  return (
    <div
      className={cx(styles.wrapper, styles[colorTemp], {
        [styles.vertical]: isVertical,
        [styles.noPaddingX]: noPaddingX,
        [sideSaber ? styles[sideSaber] : undefined]: sideSaber,
      })}
    >
      {title && (
        <header
          className={cx(styles.header, {
            // add padding that was reset by prop
            [styles.withPaddingX]: noPaddingX,
          })}
        >
          {React.cloneElement(title, { inDisplay: true })}
        </header>
      )}

      <div className={styles.inner}>{children}</div>
    </div>
  );
}

export default Display;
