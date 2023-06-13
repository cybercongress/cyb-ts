import { NumericFormat } from 'react-number-format';
import BigNumber from 'bignumber.js';
import { useState } from 'react';
import Input from '../Input';

export type Props = {
  value: string;
  width?: string;
  onChange?: Props['onValueChange'];
  // TODO: delete
  onValueChange: (val: string, event: any) => void;
  id?: string;
  title?: string;
};

function InputNumber({ value, onValueChange, onChange, ...props }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <NumericFormat
      value={new BigNumber(value).toNumber()}
      onValueChange={(values, sourceInfo) => {
        onValueChange && onValueChange(values.value, sourceInfo.event);
        onChange && onChange(values.value, sourceInfo.event);
      }}
      customInput={Input}
      thousandsGroupStyle="thousand"
      thousandSeparator=" "
      decimalScale={3}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      autoComplete="off"
      allowLeadingZeros
      focusedProps={focused}
      {...props}
    />
  );
}

export default InputNumber;
