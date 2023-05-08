import cx from 'classnames';
import styles from './Input.module.scss';
import React, { useState } from 'react';
import LinearGradientContainer, {
  Color,
} from '../LinearGradientContainer/LinearGradientContainer';

export type Props = {
  color?: Color;
  width?: string;
  title?: string;
  placeholder?: string;
  value: string;
  className?: string;
  type?: 'text' | 'password';
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      color,
      placeholder,
      onChange,
      title,
      width,
      type = 'text',
      className,
      ...props
    },
    ref
  ) => {
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
        <LinearGradientContainer active={focused} color={color} title={title}>
          <input
            type={type}
            ref={ref}
            className={className}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            {...props}
          />
        </LinearGradientContainer>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
