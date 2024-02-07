import { convertAmount } from 'src/utils/utils';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import { CSSProperties } from 'react';
import FormatNumberTokens from '../FormatNumberTokens/FormatNumberTokens';

type Props = {
  amountValue: number;
  denom: string;
  styleValue?: CSSProperties;
};

function AmountDenom({ amountValue, denom, styleValue }: Props) {
  const { traseDenom } = useIbcDenom();

  let amount = 0;

  if (amountValue && amountValue > 0) {
    const [{ coinDecimals }] = traseDenom(denom);
    amount = convertAmount(amountValue, coinDecimals);
  }

  return (
    <FormatNumberTokens text={denom} value={amount} styleValue={styleValue} />
  );
}

export default AmountDenom;
