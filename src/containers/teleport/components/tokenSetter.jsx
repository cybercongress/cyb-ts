import React from 'react';
import { Pane } from '@cybercongress/gravity';
import BalanceToken from './balanceToken';
import Select, { OptionSelect } from './select';
import Input from './input';
import { reduceTextCoin } from '../utils';
import { Denom } from '../../../components';

const renderOptions = (data, selected, valueSelect) => {
  let items = {};
  if (data !== null) {
    items = (
      <>
        {Object.keys(data)
          .filter((item) => item !== selected && item !== valueSelect)
          .map((key) => (
            <OptionSelect
              key={key}
              value={key}
              text={<Denom denomValue={key} onlyText />}
              img={<Denom justifyContent="center" denomValue={key} onlyImg />}
            />
          ))}
      </>
    );
  }

  return items;
};

function TokenSetter({
  accountBalances,
  totalSupply,
  selected,
  token,
  onChangeSelect,
  onChangeInput,
  valueInput,
  id,
  textLeft,
  readonly,
}) {
  // console.log(`token`, token);
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
          <Pane width="33px" fontSize="20px" paddingBottom={10}>
            {textLeft}
          </Pane>
          <Select
            valueSelect={token}
            textSelectValue={token !== '' ? token : ''}
            onChangeSelect={(item) => onChangeSelect(item)}
          >
            {renderOptions(totalSupply, selected, token)}
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
          readonly={readonly || false}
        />
      </Pane>
    </Pane>
  );
}

export default TokenSetter;
