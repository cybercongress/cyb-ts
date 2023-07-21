import React, { useEffect, useState } from 'react';
import styles from './Advicer.module.scss';
import cx from 'classnames';

enum Types {
  blue = 'blue',
  red = 'red',
  green = 'green',
}

type Props = {
  children: React.ReactNode;
  type?: Types;
  className?: string;
  isOpen?: boolean;
};

function Advicer({
  children,
  type = Types.blue,
  className,
  isOpen: open = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(open || false);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <div
      className={cx(styles.wrapper, styles[`color_${type}`], className, {
        [styles.open]: isOpen,
      })}
      open={isOpen}
      onClick={() => setIsOpen(!isOpen)}
    >
      <summary>Advicer</summary>
      <div>{children}</div>
    </div>
  );
}

export default Advicer;
