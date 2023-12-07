import cx from 'classnames';
import s from './TabButton.module.scss';

export const enum Position {
  Right = 'right',
  Left = 'left',
  Default = 'default',
}

export type Props = {
  children: React.ReactNode;
  isSelected: boolean;
  type?: Position;
  onSelect: () => void;
};

function TabButton({
  children,
  type = Position.Default,
  isSelected,
  onSelect,
}: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cx(
        s.tabButton,
        s[`${type}`],
        isSelected && s[`${type}Active`],
        isSelected && s.tabButtonActive
      )}
    >
      <div
        className={cx(s[`lamp_${type}`], isSelected && s[`lamp_${type}Active`])}
      >
        {children}
      </div>
    </button>
  );
}

export default TabButton;
