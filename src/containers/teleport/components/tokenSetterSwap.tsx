import React from 'react';
import { InputNumber } from 'src/components';
import { $TsFixMeFunc } from 'src/types/tsfix';
import NetworkSetter from './networkSetter';
import TokenSetter from './tokenSetter.new';

type BalanceTokenDataType = {
  [key: string]: number;
};

interface InputNumberProps {
  value: string | number;
  onValueChange: $TsFixMeFunc;
}

interface TokenSetterProps {
  accountBalances: BalanceTokenDataType[];
  totalSupply: BalanceTokenDataType[];
  selected: string;
  token: string;
  onChangeSelect: $TsFixMeFunc;
  textLeft?: string;
}

interface TokenSetterSwapProps extends InputNumberProps, TokenSetterProps {}

function TokenSetterSwap({
  accountBalances,
  totalSupply,
  selected,
  token,
  onChangeSelect,
  textLeft,
}: TokenSetterSwapProps) {
  return (
    <>
      <TokenSetter
        accountBalances={accountBalances}
        totalSupply={totalSupply}
        selected={selected}
        token={token}
        onChangeSelect={onChangeSelect}
        textLeft={textLeft}
      />
      <NetworkSetter />
      <InputNumber />
    </>
  );
}

export default TokenSetterSwap;
