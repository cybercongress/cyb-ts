import cx from 'classnames';
import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
import styles from './TabItem.module.scss';

export const enum Position {
  Right = 'right',
  Left = 'left',
}

export type Props = {
  type?: Position;
  text: string | ReactNode;
  step?: number;
  isSelected: boolean;
  to?: string;
  disable?: boolean;
  onClick?: () => void;
};

function TabItem({
  type,
  text,
  step,
  to,
  isSelected,
  disable,
  onClick,
  ...props
}: Props) {
  let Component: HTMLButtonElement | Link = 'button';
  let componentProps: object = {
    type: 'button',
  };

  if (to) {
    Component = Link;
    componentProps = {
      to,
    };
  }

  return (
    <Component
      to={to}
      onClick={onClick}
      className={cx(
        styles.tabButton,
        type && styles[`${type}`],
        isSelected && styles[type ? `${type}Active` : 'tabButtonActive'],
        disable && styles.disable
      )}
      {...props}
      {...componentProps}
    >
      {step && <span>step {step}</span>}
      {text && <span>{text}</span>}
    </Component>
  );
}

export default TabItem;
