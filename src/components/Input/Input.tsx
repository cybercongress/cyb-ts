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
  className?: string;
  type?: 'text' | 'password';
  value: string;
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
      value,
      autoFocus,
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
        <LinearGradientContainer
          active={focused}
          color={color}
          title={!(focused || value) ? title : undefined}
        >
          <input
            type={type}
            ref={ref}
            value={value}
            className={className}
            onChange={onChange}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autoFocus}
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
