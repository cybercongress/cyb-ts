import React, { useEffect, useMemo, useState } from 'react';
import { InputNumber } from 'src/components';
import LinearGradientContainer, {
  Color,
} from 'src/components/LinearGradientContainer/LinearGradientContainer';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import { $TsFixMeFunc } from 'src/types/tsfix';
import styles from './styles.module.scss';

type Props = {
  title: string;
  value: string;
  tokenSelect?: string;
  validAmount?: boolean;
  validAmountMessage?: boolean;
  validAmountMessageText?: string;
  onValueChange: $TsFixMeFunc;
};

function InputNumberDecimalScale({
  validAmount,
  value,
  tokenSelect,
  onValueChange,
  title,
  validAmountMessage,
  validAmountMessageText,
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

  if (validAmountMessage) {
    return (
      <div className={styles.containerAvailableAmount}>
        <LinearGradientContainer color={Color.Black} title={title}>
          <div className={styles.containerValue}>{validAmountMessageText}</div>
        </LinearGradientContainer>
      </div>
    );
  }

  return (
    <InputNumber
      value={value}
      onValueChange={onValueChange}
      title={title}
      color={validAmount || !value.length ? Color.Red : undefined}
      fixedDecimalScale={fixed}
      {...props}
    />
  );
}

export default InputNumberDecimalScale;
