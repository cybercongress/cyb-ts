import { NumericFormat } from 'react-number-format';
import BigNumber from 'bignumber.js';
import Input from '../Input';
import LinearGradientContainer from 'src/components/LinearGradientContainer/LinearGradientContainer';
import { useState } from 'react';

export type Props = {
  value: string;
  width?: string;
  onChange?: Props['onValueChange'];
  // TODO: delete
  onValueChange: (val: string, event: any) => void;
};

function InputNumber({ value, onValueChange, onChange, ...props }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <LinearGradientContainer active={focused}>
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
        {...props}
      />
    </LinearGradientContainer>
  );
}

export default InputNumber;
