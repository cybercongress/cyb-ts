import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import styles from './Adviser.module.scss';
import { useAdviser } from '../context';

export enum AdviserColors {
  blue = 'blue',
  red = 'red',
  green = 'green',
}

type Props = {
  children: React.ReactNode;
  color?: AdviserColors;
  className?: string;
  isOpen?: boolean;
  disabled?: boolean;
};

function Adviser({
  children,
  color = AdviserColors.blue,
  className,
  disabled,
  isOpen: forceOpen = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(forceOpen);

  const { setIsOpen: setIsOpenContext } = useAdviser();

  useEffect(() => {
    setIsOpen(forceOpen);
  }, [forceOpen]);

  useEffect(() => {
    setIsOpenContext(isOpen);
  }, [setIsOpenContext, isOpen]);

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
        <div>{children}</div>
      </div>
    </button>
  );
}

export default Adviser;
