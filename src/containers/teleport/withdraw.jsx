import React, { useEffect, useState } from 'react';
import { Pane, Input } from '@cybercongress/gravity';
import { ButtonIcon, ValueImg, Dots } from '../../components';
import BalanceToken from './components/balanceToken';

const renderOptions = (data) => {
  let items = {};
  if (data === null) {
    items = (
      <option value="">
        <Dots />
      </option>
    );
  } else {
    items = (
      <>
        <option value="">pick token</option>
        {Object.keys(data).map((key) => (
          <option key={key} value={key}>
            {data[key].coinDenom}
          </option>
        ))}
      </>
    );
  }
  return items;
};

const Select = ({ option, valueSelect, onChangeSelect }) => {
  return (
    <select
      style={{
        width: '120px',
      }}
      value={valueSelect}
      onChange={onChangeSelect}
    >
      {option}
    </select>
  );
};

function Withdraw({ stateSwap }) {
  const {
    accountBalances,
    myPools,
    selectMyPool,
    setSelectMyPool,
    amountPoolCoin,
    onChangeInputWithdraw,
  } = stateSwap;

  return (
    <Pane
      maxWidth="390px"
      display="flex"
      alignItems="center"
      flexDirection="column"
    >
      <Pane>
        <BalanceToken data={accountBalances} token={selectMyPool} />
        <Pane display="flex" alignItems="center" marginBottom={20}>
          {/* <Pane fontSize="18px">{textLeft}</Pane> */}
          <Select
            option={renderOptions(myPools)}
            valueSelect={selectMyPool}
            onChangeSelect={(e) => setSelectMyPool(e.target.value)}
          />
          <Input
            // id={id}
            value={amountPoolCoin}
            onChange={(e) => onChangeInputWithdraw(e)}
            placeholder="amount"
            width="200px"
            height={42}
            fontSize="20px"
            textAlign="end"
          />
        </Pane>
      </Pane>
    </Pane>
  );
}

export default Withdraw;
