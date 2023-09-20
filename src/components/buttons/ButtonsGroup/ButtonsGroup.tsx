import styles from './ButtonsGroup.module.scss';
import cx from 'classnames';

type Props = {
  items: {
    label: string;
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
          key={item.label}
          className={cx({
            [styles['--checked']]: item.checked,
            [styles['--disabled']]: item.disabled,
          })}
        >
          <label>
            <input
              type={type}
              name={item.label}
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
