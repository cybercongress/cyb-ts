import { useContext } from 'react';
import { Pane } from '@cybercongress/gravity';
import { Dots } from '../../../components';
import { formatNumber, getDisplayAmount } from '../../../utils/utils';
import { AppContext } from '../../../context';

type DataBalanceToken = {
  [key: string]: number;
};

type BalanceTokenProps = {
  token: string;
  data: DataBalanceToken[] | null;
};

function BalanceToken({ token, data }: BalanceTokenProps) {
  const { traseDenom } = useContext(AppContext);
  let balance = 0;

  if (data && data[token]) {
    const { coinDecimals } = traseDenom(token);
    balance = formatNumber(getDisplayAmount(data[token], coinDecimals));
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
      <Pane>{!data ? <Dots /> : balance}</Pane>
    </Pane>
  );
}

export default BalanceToken;
