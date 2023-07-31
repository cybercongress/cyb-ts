import React, { useEffect, useMemo, useState } from 'react';
import { InputNumber } from 'src/components';
import { Color } from 'src/components/LinearGradientContainer/LinearGradientContainer';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import { $TsFixMeFunc } from 'src/types/tsfix';

type Props = {
  title: string;
  value: string;
  tokenSelect?: string;
  validAmount?: boolean;
  onValueChange: $TsFixMeFunc;
};

function InputNumberDecimalScale({
  validAmount,
  value,
  tokenSelect,
  onValueChange,
  title,
  ...props
}: Props) {
  const { traseDenom } = useIbcDenom();
  const [fixed, setFixed] = useState(false);

  useEffect(() => {
    if (traseDenom && tokenSelect) {
      const [{ coinDecimals }] = traseDenom(tokenSelect);
      if (coinDecimals > 0) {
        setFixed(true);
        return;
      }
    }
    setFixed(false);
  }, [traseDenom, tokenSelect]);

  return (
    <InputNumber
      value={value}
      onValueChange={onValueChange}
      title={title}
      color={validAmount ? Color.Pink : undefined}
      fixedDecimalScale={fixed}
      {...props}
    />
  );
}

export default InputNumberDecimalScale;
