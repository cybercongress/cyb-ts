import cx from 'classnames';
import React, { useState } from 'react';
import styles from './Input.module.scss';
import LinearGradientContainer, {
  Color,
} from '../LinearGradientContainer/LinearGradientContainer';
import TextareaAutosize from 'react-textarea-autosize';

export type Props = {
  color?: Color;
  width?: string;
  title?: string;
  className?: string;
  focusedProps?: boolean;
  isTextarea?: boolean;
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
      focusedProps,
      isTextarea,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);

    const Tag = isTextarea ? TextareaAutosize : 'input';

    return (
      <div
        className={cx(
          styles.textbox,
          color && styles[color],
          focused && styles.focused,
          isTextarea && styles.textarea
        )}
        style={{ width }}
      >
        <LinearGradientContainer
          active={focusedProps || focused}
          color={color}
          title={!(focused || value) ? title : undefined}
        >
          <Tag
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
