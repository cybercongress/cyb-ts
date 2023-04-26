import cx from 'classnames';
import styles from './Input.module.scss';

export type Props = {
  color?: 'pink';
  width?: string;
  placeholder?: string;
};

function Input({ color, placeholder, width, ...props }: Props) {
  return (
    <div className={styles.textbox} style={{ width }}>
      <div
        className={cx(styles.textboxBottomGradient, styles.textboxFace, {
          [styles.textboxFacePink]: color === 'pink',
        })}
      />

      <div
        className={cx(styles.textboxBottomLine, {
          [styles.textboxBottomLinePink]: color === 'pink',
        })}
      />

      <input
        className={styles.textboxText}
        type="text"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}

export default Input;
