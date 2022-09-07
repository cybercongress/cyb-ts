import React from 'react';
import { Pane } from '@cybercongress/gravity';
import BalanceToken from './balanceToken';
import Select, { OptionSelect } from './select';
import Input from './input';
import { networkList } from '../utils';
// import { getNetworks } from '../hooks/getContract';
import { DenomArr } from '../../../components';

const renderOptions = (data, selected, valueSelect, tokens) => {
  let items = {};
  // denomData
  if (tokens && data !== null) {

    items = (
      <>
        {Object.keys(data)
            // .filter((item) => item !== selected && item !== valueSelect)
            .filter((item) =>
                !!Object.prototype.hasOwnProperty.call(tokens, item.toUpperCase()))
          .map((key) => (
            <OptionSelect
              key={key}
              value={key}
              bgrImg={key.includes('pool')}
              text={<DenomArr denomData={tokens[key.toUpperCase()]} denomValue={key} onlyText />}
              img={
                <DenomArr justifyContent="center" denomData={tokens[key.toUpperCase()]} denomValue={key} onlyImg />
              }
            />
          ))}
      </>
    );
  }

  return items;
};

const renderNetwork = (data, selected) => {
  let items = {};

  if (data !== null) {
    items = (
      <>
        { Object.values(data)
          // .filter((item) => item !== selected)
          .map((value) => (
            <OptionSelect
              key={value.id}
              value={value.chain_id}
              // bgrImg={key.includes('pool')}
              text={<DenomArr denomData={data[value.chain_id]} denomValue={value.name} onlyText />}
              img={
                <DenomArr justifyContent="center" denomData={data[value.chain_id]} denomValue={value.name} onlyImg />
              }
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
  selectedNetwork,
  onChangeSelectNetwork,
  ibc,
  ibcTokenB,
  balanceIbc,
  denomIbc,
  swap,
  networks,
  tokens,
}) {
  // console.log(`denomIbc`, denomIbc);
  // console.log('balanceIbc', balanceIbc);

  return (
    <Pane width="inherit">


      <Pane
        display="grid"
        gridTemplateColumns="40px 1fr 1fr"
        gridGap="27px"
        alignItems="center"
        marginBottom={20}
      >
        <Pane width="33px" fontSize="20px" paddingBottom={10}>
          {textLeft}
        </Pane>
        {swap && (
          <Select
            valueSelect={selectedNetwork}
            denomData={(networks && selectedNetwork !== '') ? networks[selectedNetwork] : { }}
            textSelectValue={networks && selectedNetwork !== '' ? networks[selectedNetwork].name : ''}
            onChangeSelect={(item) => onChangeSelectNetwork(item)}
          >
            {renderNetwork(networks, selectedNetwork)}
          </Select>
        )}

        {!ibcTokenB && tokens && (
          <Select
            valueSelect={token}
            denomData={(tokens && token !== '') ? tokens[token.toUpperCase()] : { }}
            textSelectValue={token !== '' ? token : ''}
            onChangeSelect={(item) => onChangeSelect(item)}
          >
            {renderOptions(totalSupply, selected, token, tokens)}
          </Select>
        )}
      </Pane>
      {!ibcTokenB && totalSupply && (
          <Input
              id={id}
              value={valueInput}
              maxValue={totalSupply[token]}
              onChange={(e) => onChangeInput(e)}
              placeholder="amount"
              width="200px"
              height={42}
              fontSize="20px"
              autoComplete="off"
              textAlign="end"
              readonly={readonly || false}
          />
      )}
      {!ibcTokenB && !readonly && (
          <BalanceToken
              data={ibc ? balanceIbc : accountBalances}
              token={ibc ? denomIbc : token}
          />
      )}
    </Pane>
  );
}

export default TokenSetter;
