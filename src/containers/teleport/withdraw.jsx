import React, { useEffect, useState } from 'react';
import { Pane } from '@cybercongress/gravity';
import { NumericFormat } from 'react-number-format';
import { ButtonIcon, ValueImg, Dots } from '../../components';
import BalanceToken from './components/balanceToken';
import Input from './components/input';
import Select, { OptionSelect } from './components/select';

const groupImgToken = (pool) => (
  <div style={{ display: 'flex' }}>
    <ValueImg text={pool.reserveCoinDenoms[0]} onlyImg />
    <ValueImg
      text={pool.reserveCoinDenoms[1]}
      onlyImg
      zIndexImg={1}
      marginContainer="0px 0px 0px -15px"
    />
  </div>
);

const renderOptions = (data) => {
  let items = {};
  if (data !== null) {
    items = (
      <>
        {Object.keys(data).map((key) => (
          <OptionSelect
            key={key}
            value={key}
            text={data[key].coinDenom}
            img={groupImgToken(data[key])}
          />
          // <option key={key} value={key}>
          //   {data[key].coinDenom}
          // </option>
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
      display="flex"
      alignItems="center"
      flexDirection="column"
    >
      <Pane>
        <BalanceToken data={accountBalances} token={selectMyPool} />
        <Pane
          display="grid"
          gridTemplateColumns="153px 170px"
          gridGap="27px"
          alignItems="center"
          marginBottom={20}
        >
          {/* <Pane fontSize="18px">{textLeft}</Pane> */}
          <Pane display="flex" alignItems="center">
            <Pane width="33px" fontSize="20px" paddingBottom={10} />
            <Select
              valueSelect={selectMyPool}
              textSelectValue={
                selectMyPool !== '' ? myPools[selectMyPool].coinDenom : ''
              }
              imgSelectValue={
                selectMyPool !== '' ? groupImgToken(myPools[selectMyPool]) : ''
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
      </Pane>
    </Pane>
  );
}

export default Withdraw;
