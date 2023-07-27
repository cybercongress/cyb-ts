import React, { useEffect, useState } from 'react';
import styles from './Adviser.module.scss';
import cx from 'classnames';
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
  isOpen: open = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(open || false);

  const { setIsOpen: isOp } = useAdviser();

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    isOp(isOpen);
  }, [isOp, isOpen]);

  return (
    // TODO: use <details> tag
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <button
      type="button"
      disabled={disabled}
      className={cx(styles.wrapper, styles[`color_${color}`], className, {
        [styles.open]: isOpen && children,
      })}
      // open={isOpen}
      onClick={() => setIsOpen(!isOpen)}
    >
      <summary>Adviser</summary>
      <div>{children}</div>
    </button>
  );
}

export default Adviser;
