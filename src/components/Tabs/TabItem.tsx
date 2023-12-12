import cx from 'classnames';
import { Link } from 'react-router-dom';
import styles from './TabItem.module.scss';

export const enum Position {
  Right = 'right',
  Left = 'left',
}

export type Props = {
  type?: Position;
  text: string | JSX.Element;
  isSelected: boolean;
  to?: string;
  onClick?: () => void;
};

function TabItem({ type, text, to, isSelected, onClick, ...props }: Props) {
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
        isSelected && styles[type ? `${type}Active` : 'tabButtonActive']
      )}
      {...props}
      {...componentProps}
    >
      {text}
    </Component>
  );
}

export default TabItem;
