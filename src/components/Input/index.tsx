import cx from 'classnames';
import { NumericFormat } from 'react-number-format';
import styles from './Input.module.scss';

function Input({ color, ...props }) {
  return (
    <div className={styles.textbox}>
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

      <input className={styles.textboxText} type="text" {...props} />
    </div>
  );
}

function InputNumber({ value, onValueChange, ...props }) {
  return (
    <NumericFormat
      value={value}
      onValueChange={(values, sourceInfo) =>
        onValueChange(values.value, sourceInfo.event)
      }
      customInput={Input}
      thousandsGroupStyle="thousand"
      thousandSeparator=" "
      decimalScale={3}
      autoComplete="off"
      allowLeadingZeros
      {...props}
    />
  );
}

export { Input, InputNumber };
