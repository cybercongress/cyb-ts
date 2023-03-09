import React, { useEffect, useState } from 'react';
import { Pane } from '@cybercongress/gravity';
import { NumericFormat } from 'react-number-format';
import { ButtonIcon, ValueImg, Dots, Denom, DenomArr } from '../../components';
import BalanceToken from './components/balanceToken';
import Input from './components/input';
import Select, { OptionSelect } from './components/select';

const renderOptions = (data) => {
  let items = {};
  if (data !== null) {
    items = (
      <>
        {Object.keys(data).map((key) => (
          <OptionSelect
            key={key}
            value={key}
            text={
              <DenomArr
                denomValue={data[key].poolCoinDenom}
                onlyText
                tooltipStatusText={false}
              />
            }
            img={
              <DenomArr
                denomValue={data[key].poolCoinDenom}
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
      width="375px"
      display="flex"
      alignItems="center"
      flexDirection="column"
    >
      <BalanceToken data={accountBalances} token={selectMyPool} />

      {/* <Pane fontSize="18px">{textLeft}</Pane> */}
      <Pane
        display="grid"
        width="100%"
        gridTemplateColumns="40px 1fr"
        gridGap="27px"
        marginBottom={20}
      >
        <Pane width="33px" fontSize="20px" paddingBottom={10}>
          sub
        </Pane>
        <Select
          width="100%"
          valueSelect={selectMyPool}
          textSelectValue={
            selectMyPool !== '' ? myPools[selectMyPool].poolCoinDenom : ''
          }
          onChangeSelect={(value) => setSelectMyPool(value)}
        >
          {renderOptions(myPools)}
        </Select>
      </Pane>
      <NumericFormat
        value={amountPoolCoin}
        onValueChange={(values, sourceInfo) =>
          onChangeInputWithdraw(values.value, sourceInfo.event)
        }
        customInput={Input}
        thousandsGroupStyle="thousand"
        thousandSeparator=" "
        decimalScale={3}
        autoComplete="off"
      />
      {/* <Input
            // id={id}
            value={amountPoolCoin}
            onChange={(e) => onChangeInputWithdraw(e)}
            placeholder="amount"
            width="200px"
            height={42}
            fontSize="20px"
            textAlign="end"
          /> */}
    </Pane>
  );
}

export default Withdraw;
