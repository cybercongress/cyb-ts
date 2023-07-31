import cx from 'classnames';
import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './Input.module.scss';
import LinearGradientContainer, {
  Color,
} from '../LinearGradientContainer/LinearGradientContainer';

export type Props = {
  color?: Color;
  width?: string;
  title?: string;
  className?: string;
  classNameTextbox?: string;
  focusedProps?: boolean;
  isTextarea?: boolean;
  type?: 'text' | 'password';
  error?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlurFnc?: () => void;
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
      classNameTextbox,
      focusedProps,
      isTextarea,
      onBlurFnc,
      error,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);

    const Tag = isTextarea ? TextareaAutosize : 'input';

    const handlerOnBlur = () => {
      setFocused(false);

      if (onBlurFnc) {
        onBlurFnc();
      }
    };

    return (
      <div
        className={cx(
          styles.textbox,
          color && styles[color],
          focused && styles.focused,
          isTextarea && styles.textarea,
          classNameTextbox
        )}
        style={{ width }}
      >
        <LinearGradientContainer
          active={focusedProps || focused}
          color={color}
          title={title}
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
            onBlur={() => handlerOnBlur()}
            placeholder={placeholder}
            {...props}
          />
        </LinearGradientContainer>
        {error && <div className={styles.error}>{error}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
