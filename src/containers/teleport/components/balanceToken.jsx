import React from 'react';
import { Pane } from '@cybercongress/gravity';
import { Dots } from '../../../components';
import { reduceAmounToken } from '../utils';
import { formatNumber } from '../../../utils/utils';

const BalanceToken = ({ token, data }) => {
  let balance = 0;

  if (data === null) {
    balance = <Dots />;
  } else if (data[token]) {
    balance = formatNumber(reduceAmounToken(data[token], token));
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
