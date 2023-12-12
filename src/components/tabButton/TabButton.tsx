import cx from 'classnames';
import { Link } from 'react-router-dom';
import styles from './TabButton.module.scss';

export const enum Position {
  Right = 'right',
  Left = 'left',
}

type optionsProps = {
  to: string;
  text: string;
};

export type Props = {
  options: optionsProps[];
  selected: string;
};

function TabButton({ options, selected }: Props) {
  return (
    <>
      {options.map((item, index) => {
        const type =
          index === 0
            ? Position.Left
            : index === options.length - 1
            ? Position.Right
            : undefined;

        const isSelected = selected === item.text;

        return (
          <Link
            key={item.text}
            to={item.to}
            className={cx(
              styles.tabButton,
              type && styles[`${type}`],
              isSelected && styles[type ? `${type}Active` : 'tabButtonActive']
            )}
          >
            {item.text}
          </Link>
        );
      })}
    </>
  );
}

export default TabButton;
