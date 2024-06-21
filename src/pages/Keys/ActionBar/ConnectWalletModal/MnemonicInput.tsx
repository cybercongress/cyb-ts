import { ComponentProps, useCallback } from 'react';
import { Input } from 'src/components';

type InputProps = ComponentProps<typeof Input>;
interface MnemonicInputProps {
  index: number;
  values: Record<number, string>;
  isTouched: boolean;

  onBlurFunc: InputProps['onBlurFnc'];
  setValues(update: Record<number, string>): void;
}

export default function MnemonicInput({
  index,
  values,
  isTouched,
  setValues,
  onBlurFunc,
}: MnemonicInputProps) {
  const onInputChange = useCallback<InputProps['onChange']>(
    (e) => {
      const update = { ...values };
      update[index] = e.target.value;
      setValues(update);
    },
    [index, setValues, values]
  );

  return (
    <Input
      title={`${index + 1}`}
      error={isTouched && !values[index] ? `${index} is missing` : undefined}
      value={values[index]}
      onChange={onInputChange}
      onBlurFnc={onBlurFunc}
    />
  );
}
