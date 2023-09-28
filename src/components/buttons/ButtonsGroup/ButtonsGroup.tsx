import cx from 'classnames';
import styles from './ButtonsGroup.module.scss';

type Props = {
  items: {
    label: string | JSX.Element;
    checked?: boolean;
    disabled?: boolean;
    name?: string;
  }[];
  onChange: (value: string) => void;
  type: 'radio' | 'checkbox';
};

function ButtonsGroup({ items, onChange, type }: Props) {
  return (
    <ul className={styles.wrapper}>
      {items.map((item, i) => (
        <li
          key={i}
          className={cx({
            [styles['--checked']]: item.checked,
            [styles['--disabled']]: item.disabled,
          })}
        >
          <label>
            <input
              type={type}
              name={item.name}
              checked={item.checked}
              onChange={() =>
                !item.disabled && onChange(item.name || item.label)
              }
            />
            {item.label}
          </label>
        </li>
      ))}
    </ul>
  );
}

export default ButtonsGroup;
