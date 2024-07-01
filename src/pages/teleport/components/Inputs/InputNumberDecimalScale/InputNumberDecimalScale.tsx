import { useEffect, useState } from 'react';
import { InputNumber } from 'src/components';
import LinearGradientContainer, {
  Color,
} from 'src/components/LinearGradientContainer/LinearGradientContainer';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import { $TsFixMeFunc } from 'src/types/tsfix';
import styles from './InputNumberDecimalScale.module.scss';

type Props = {
  id?: string;
  title: string;
  value: string;
  tokenSelect?: string;
  validAmount?: boolean;
  validAmountMessage?: boolean;
  validAmountMessageText?: string;
  autoFocus?: boolean;
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
  const { tracesDenom } = useIbcDenom();
  const [fixed, setFixed] = useState(false);

  useEffect(() => {
    if (tracesDenom && tokenSelect) {
      const [{ coinDecimals }] = tracesDenom(tokenSelect);
      if (coinDecimals > 0) {
        setFixed(true);
        return;
      }
    }
    setFixed(false);
  }, [tracesDenom, tokenSelect]);

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
      color={validAmount || value.length === 0 ? Color.Red : Color.Green}
      fixedDecimalScale={fixed}
      {...props}
    />
  );
}

export default InputNumberDecimalScale;
