import { NumericFormat } from 'react-number-format';
import BigNumber from 'bignumber.js';
import Input from '../Input';

export type Props = {
  value: string;
  width?: string;
  onValueChange: (val: string, event: any) => void;
};

function InputNumber({ value, onValueChange, ...props }: Props) {
  return (
    <NumericFormat
      value={new BigNumber(value).toNumber()}
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

export default InputNumber;
