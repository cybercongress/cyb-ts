import { useContext } from 'react';
import { Pane } from '@cybercongress/gravity';
import { Dots } from '../../../components';
import { formatNumber, getDisplayAmount } from '../../../utils/utils';
import { AppContext } from '../../../context';
import { ObjKeyValue } from 'src/types/data';

type BalanceTokenProps = {
  token: string;
  data: ObjKeyValue | null;
};

function BalanceToken({ token, data }: BalanceTokenProps) {
  const { traseDenom } = useContext(AppContext);
  let balance = 0;

  if (data) {
    const { coinDecimals } = traseDenom(token);
    balance = getDisplayAmount(data[token], coinDecimals);
  }

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
