import { NumericFormat } from 'react-number-format';
import BigNumber from 'bignumber.js';
import { useState } from 'react';
import { Color } from 'src/components/LinearGradientContainer/LinearGradientContainer';
import Input from '../Input';

export type Props = {
  value: string;
  width?: string;
  onChange?: Props['onValueChange'];
  // TODO: delete
  onValueChange: (val: string, event: any) => void;
  id?: string;
  title?: string;
  color?: Color;
  fixedDecimalScale?: boolean;
  maxValue?: number;
  min?: number;
};

function InputNumber({
  value,
  onValueChange,
  fixedDecimalScale,
  onChange,
  maxValue,
  min,
  ...props
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <NumericFormat
      value={value}
      onValueChange={(values, sourceInfo) => {
        onValueChange && onValueChange(values.value, sourceInfo.event);
        onChange && onChange(values.value, sourceInfo.event);
      }}
      valueIsNumericString
      allowLeadingZeros
      customInput={Input}
      isAllowed={(values) => {
        const { floatValue } = values;
        if (typeof floatValue === 'number' && maxValue) {
          return floatValue <= maxValue;
        }
        return true;
      }}
      maxValue={maxValue}
      min={min}
      thousandsGroupStyle="thousand"
      thousandSeparator=" "
      decimalScale={3}
      fixedDecimalScale={fixedDecimalScale}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      autoComplete="off"
      focusedProps={focused}
      {...props}
    />
  );
}

export default InputNumber;
