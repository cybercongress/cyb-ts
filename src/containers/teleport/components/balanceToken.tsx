import { Pane } from '@cybercongress/gravity';
import { ObjKeyValue } from 'src/types/data';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import { useMemo } from 'react';
import { Dots } from '../../../components';
import { formatNumber, getDisplayAmount } from '../../../utils/utils';

type BalanceTokenProps = {
  token: string;
  data: ObjKeyValue | null;
};

function BalanceToken({ token, data }: BalanceTokenProps) {
  const { traseDenom } = useIbcDenom();

  const balance = useMemo(() => {
    if (data && token.length > 0 && data[token]) {
      const [{ coinDecimals }] = traseDenom(token);
      return getDisplayAmount(data[token], coinDecimals);
    }
    return 0;
  }, [data, token, traseDenom]);

  return (
    <Pane
      display="flex"
      alignItems="center"
      color="#777777"
      fontSize="18px"
      width="100%"
      justifyContent="space-between"
      marginBottom={12}
    >
      <Pane>Available</Pane>
      <Pane>{!data ? <Dots /> : formatNumber(balance)}</Pane>
    </Pane>
  );
}

export default BalanceToken;
