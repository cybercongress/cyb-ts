import React from 'react';
import { Pane } from '@cybercongress/gravity';
import { DenomArr, InputNumber, OptionSelect } from '../../components';
import BalanceToken from './components/balanceToken';
import Select from './components/select';

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
      <InputNumber
        value={amountPoolCoin}
        onValueChange={onChangeInputWithdraw}
      />
    </Pane>
  );
}

export default Withdraw;
