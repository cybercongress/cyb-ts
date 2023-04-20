import { NumericFormat } from 'react-number-format';
import Input from '../Input';

export type Props = {
  value: string;
  onValueChange: (val: string, event: any) => void;
};

function InputNumber({ value, onValueChange, ...props }: Props) {
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

export default InputNumber;
