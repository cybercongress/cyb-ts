import cx from 'classnames';
import TextareaAutosize from 'react-textarea-autosize';
import React, { useEffect, useState } from 'react';
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
  onFocusFnc?: () => void;
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
      onFocusFnc,
      error,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(focusedProps || false);

    useEffect(() => {
      if (!ref?.current) {
        return;
      }

      if (focused) {
        ref.current.focus();
      } else {
        ref.current.blur();
      }
    }, [focused, ref]);

    useEffect(() => {
      if (typeof focusedProps === 'boolean') {
        setFocused(focusedProps);
      }
    }, [focusedProps]);

    const Tag = isTextarea ? TextareaAutosize : 'input';

    const handlerOnFocused = () => {
      setFocused(true);

      if (onFocusFnc) {
        onFocusFnc();
      }
    };

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
            onFocus={handlerOnFocused}
            onBlur={handlerOnBlur}
            placeholder={placeholder}
            autoComplete="off"
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
