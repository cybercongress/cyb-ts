import cx from 'classnames';
import styles from './Input.module.scss';
import { useState } from 'react';
import LinearGradientContainer, {
  Color,
} from '../LinearGradientContainer/LinearGradientContainer';

export type Props = {
  color?: Color;
  width?: string;
  title?: string;
  placeholder?: string;
  value: string;
  type?: 'text' | 'password';
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function Input({
  color,
  placeholder,
  onChange,
  title,
  width,
  type = 'text',
  ...props
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={cx(
        styles.textbox,
        color && styles[color],
        focused && styles.focused
      )}
      style={{ width }}
    >
      <input
        type={type}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        {...props}
      />

      <LinearGradientContainer active={focused} color={color} title={title} />
    </div>
  );
}

export default Input;
