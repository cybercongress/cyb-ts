import cx from 'classnames';
import s from './TabButton.module.scss';

export const enum Position {
  Right = 'right',
  Left = 'left',
}

export type Props = {
  children: React.ReactNode;
  isSelected: boolean;
  type?: Position;
  onSelect: () => void;
};

function TabButton({ children, type, isSelected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cx(
        s.tabButton,
        type && s[`${type}`],
        isSelected && s[type ? `${type}Active` : 'tabButtonActive']
      )}
    >
      {children}
    </button>
  );
}

export default TabButton;
