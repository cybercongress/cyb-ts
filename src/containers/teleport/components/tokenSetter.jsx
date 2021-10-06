import React from 'react';
import { Pane } from '@cybercongress/gravity';
import BalanceToken from './balanceToken';
import Select from './select';
import Input from './input';
import { reduceTextCoin } from '../utils';

const renderOptions = (data, selected) => {
  let items = {};

  if (data === null) {
    items = <option value="">pick token</option>;
  } else {
    items = (
      <>
        <option value="">pick token</option>
        {Object.keys(data)
          .filter((item) => item.indexOf('pool') === -1 && item !== selected)
          .map((key) => (
            <option
              key={key}
              value={key}
              // style={{
              //   backgroundImage: `url(${tokenImg(key)})`,
              // }}
            >
              {reduceTextCoin(key)}
            </option>
          ))}
      </>
    );
  }

  return items;
};

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
      <Pane
        display="grid"
        gridTemplateColumns="153px 170px"
        gridGap="27px"
        alignItems="center"
        marginBottom={20}
      >
        <Pane display="flex" alignItems="center">
          <Pane fontSize="18px">{textLeft}</Pane>
          <Select
            data={accountBalances}
            selected={selected}
            valueSelect={token}
            onChangeSelect={(e) => onChangeSelect(e.target.value)}
          >
            {/* {renderOptions(accountBalances, selected)} */}
          </Select>
        </Pane>
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
