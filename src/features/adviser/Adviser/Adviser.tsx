import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import styles from './Adviser.module.scss';
// import TypeIt from 'typeit-react';
import TypeIt from './typeit.js';

export enum AdviserColors {
  blue = 'blue',
  green = 'green',
  red = 'red',
  purple = 'purple',
  yellow = 'yellow',
}

export type Props = {
  children: React.ReactNode | string;
  color?: AdviserColors | keyof typeof AdviserColors;
  disabled?: boolean;
  className?: string;

  isOpen?: boolean;
  openCallback?: (isOpen: boolean) => void;
};

function Adviser({
  children,
  color = AdviserColors.blue,
  className,
  disabled,
  openCallback,
  isOpen: forceOpen = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(forceOpen);

  useEffect(() => {
    setIsOpen(forceOpen);
  }, [forceOpen]);

  useEffect(() => {
    // context infinity render
    const timeout = setTimeout(() => {
      if (openCallback && isOpen !== forceOpen) {
        openCallback(isOpen);
      }
    }, 1);

    return () => {
      clearTimeout(timeout);
    };
  }, [openCallback, isOpen, forceOpen]);

  return (
    // maybe try use <details> tag
    <button
      type="button"
      disabled={disabled}
      className={cx(styles.wrapper, styles[`color_${color}`], className, {
        [styles.open]: isOpen && children,
      })}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className={styles.summary}>Adviser</span>
      <div className={styles.content}>
        <TypeIt
          // for resetting the animation
          key={children}
          as="div"
          className={styles.typer}
          options={{
            speed: 30,
            cursor: false,
            waitUntilVisible: true,
          }}
        >
          {children}
        </TypeIt>
      </div>
    </button>
  );
}

export default Adviser;
