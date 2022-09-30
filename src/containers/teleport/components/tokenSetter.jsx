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
        gridTemplateColumns="220px 220px"
        gridGap="57px"
        alignItems="center"
        marginBottom={20}
      >

        {/* <Pane> */}
        {!ibcTokenB && totalSupply && (
            <Input
                id={id}
                value={valueInput}
                maxValue={totalSupply[token]}
                token={token}
                onChange={(e) => onChangeInput(e)}
                placeholder="amount"
                datatype="amount"
                width="200px"
                height={42}
                fontSize="20px"
                autoComplete="off"
                textAlign="end"
                description="choose amount to send"
                readonly={readonly || false}
            />
        )}
        {/* {!ibcTokenB && !readonly && ( */}
        {/*     <BalanceToken */}
        {/*         data={ibc ? balanceIbc : accountBalances} */}
        {/*         token={ibc ? denomIbc : token} */}
        {/*     /> */}
        {/* )} */}


        {!ibcTokenB && tokens && (
            <Select
                valueSelect={token}
                denomData={(tokens && token !== '') ? tokens[token.toUpperCase()] : { }}
                textSelectValue={token !== '' ? token : ''}
                onChangeSelect={(item) => onChangeSelect(item)}
                description="choose token to send"
            >
              {renderOptions(totalSupply, selected, token, tokens)}
            </Select>
        )}
          {/* </Pane> */}

        {!ibcTokenB && totalSupply && (
            <Input
                id={id}
                value={ibc ? balanceIbc[ibc ? denomIbc : token] : accountBalances[ibc ? denomIbc : token]}
                datatype="amount"
                // maxValue={totalSupply[token]}
                // onChange={(e) => onChangeInput(e)}
                placeholder="amount"
                width="250px"
                height={42}
                fontSize="20px"
                autoComplete="off"
                textAlign="end"
                description="choose amount to send"
                readonly="true"
            />
        )}

        {/* <Pane> */}
        {swap && (
          <Select
            valueSelect={selectedNetwork}
            denomData={(networks && selectedNetwork !== '') ? networks[selectedNetwork] : { }}
            textSelectValue={networks && selectedNetwork !== '' ? networks[selectedNetwork].name : ''}
            onChangeSelect={(item) => onChangeSelectNetwork(item)}
            description="choose source network"
          >
            {renderNetwork(networks, selectedNetwork)}
          </Select>
        )}
        {/*   </Pane> */}


        <Pane width="33px" fontSize="20px" paddingBottom={10}>
          {/* {textLeft} */}
        </Pane>






      </Pane>

    </Pane>
  );
}

export default TokenSetter;
