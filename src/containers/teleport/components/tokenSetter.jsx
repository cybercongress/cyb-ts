import React from 'react';
import { Pane } from '@cybercongress/gravity';
import BalanceToken from './balanceToken';
import Select from './select';
import Input from './input';

function TokenSetter({
  accountBalances,
  selected,
  token,
  onChangeSelect,
  onChangeInput,
  valueInput,
  id,
  textLeft,
}) {
  return (
    <Pane>
      <BalanceToken data={accountBalances} token={token} />
      <Pane display="flex" alignItems="center" marginBottom={20}>
        <Pane fontSize="18px">{textLeft}</Pane>
        <Select
          data={accountBalances}
          valueSelect={token}
          selected={selected}
          onChangeSelect={(e) => onChangeSelect(e.target.value)}
        />
        <Input
          id={id}
          value={valueInput}
          onChange={(e) => onChangeInput(e)}
          placeholder="amount"
          width="200px"
          height={42}
          fontSize="20px"
          autoComplete="off"
          textAlign="end"
        />
      </Pane>
    </Pane>
  );
}

export default TokenSetter;
