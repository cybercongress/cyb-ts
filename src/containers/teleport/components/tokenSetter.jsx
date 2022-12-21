import React from 'react';
import { Pane } from '@cybercongress/gravity';
import { NumericFormat } from 'react-number-format';
import BalanceToken from './balanceToken';
import Select, { OptionSelect } from './select';
import Input from './input';
import { networkList } from '../utils';
import { DenomArr } from '../../../components';

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
              bgrImg={key.includes('pool')}
              text={
                <DenomArr denomValue={key} onlyText tooltipStatusText={false} />
              }
              img={
                <DenomArr
                  justifyContent="center"
                  denomValue={key}
                  onlyImg
                  tooltipStatusImg={false}
                />
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
        {Object.keys(data).map((key) => (
          <OptionSelect
            key={key}
            value={key}
            bgrImg={key.includes('pool')}
            text={
              <DenomArr
                type="network"
                denomValue={data[key]}
                onlyText
                tooltipStatusText={false}
              />
            }
            img={
              <DenomArr
                type="network"
                justifyContent="center"
                denomValue={data[key]}
                onlyImg
                tooltipStatusImg={false}
              />
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
  selectedNetwork,
  onChangeSelectNetwork,
  ibc,
  ibcTokenB,
  balanceIbc,
  denomIbc,
  swap,
  network,
}) {
  // console.log(`denomIbc`, denomIbc);
  // console.log('balanceIbc', balanceIbc);

  return (
    <Pane width="inherit">
      {!ibcTokenB && (
        <BalanceToken
          data={ibc ? balanceIbc : accountBalances}
          token={ibc ? denomIbc : token}
        />
      )}

      <Pane
        display="grid"
        gridTemplateColumns="40px 1fr"
        gridGap="27px"
        alignItems="flex-start"
        marginBottom={20}
      >
        <Pane width="33px" fontSize="20px" paddingBottom={10}>
          {textLeft}
        </Pane>
        <Pane width="100%" display="flex" flexDirection="column" gap="20px">
          {!ibcTokenB && (
            <Select
              width="100%"
              valueSelect={token}
              textSelectValue={token !== '' ? token : ''}
              onChangeSelect={(item) => onChangeSelect(item)}
            >
              {renderOptions(totalSupply, selected, token)}
            </Select>
          )}
          {swap && (
            <Select
              type="network"
              width="100%"
              valueSelect={selectedNetwork}
              textSelectValue={selectedNetwork !== '' ? selectedNetwork : ''}
              onChangeSelect={(item) => onChangeSelectNetwork(item)}
            >
              {renderNetwork(network)}
            </Select>
          )}
        </Pane>
      </Pane>
      {!ibcTokenB && (
        <NumericFormat
          id={id}
          value={valueInput}
          onValueChange={(values, sourceInfo) =>
            onChangeInput(values.value, sourceInfo.event)
          }
          customInput={Input}
          thousandsGroupStyle="thousand"
          thousandSeparator=" "
          decimalScale={3}
          autoComplete="off"
        />
        // <Input
        //   id={id}
        //   value={valueInput}
        //   onChange={(e) => onChangeInput(e)}
        //   placeholder="amount"
        //   width="200px"
        //   height={42}
        //   fontSize="20px"
        //   autoComplete="off"
        //   textAlign="end"
        // />
      )}
    </Pane>
  );
}

export default TokenSetter;
