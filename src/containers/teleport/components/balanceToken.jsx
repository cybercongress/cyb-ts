import React, { useContext } from 'react';
import { Pane } from '@cybercongress/gravity';
import { Dots } from '../../../components';
import { formatNumber, getDisplayAmount } from '../../../utils/utils';
import { AppContext } from '../../../context';

const BalanceToken = ({ token, data }) => {
  const { traseDenom } = useContext(AppContext);
  let balance = 0;

  if (data === null) {
    balance = <Dots />;
  } else if (data[token]) {
    const { coinDecimals } = traseDenom(token);
    balance = formatNumber(getDisplayAmount(data[token], coinDecimals));
  } else {
    balance = 0;
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
      <Pane>{balance}</Pane>
    </Pane>
  );
};

export default BalanceToken;
