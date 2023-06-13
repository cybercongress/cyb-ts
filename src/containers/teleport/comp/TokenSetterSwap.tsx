import React, { useMemo } from 'react';
import { DenomArr, InputNumber, AvailableAmount } from 'src/components';
import { ObjKeyValue } from 'src/types/data';
import Select, { SelectOption } from 'src/components/Select/index';
import { Col, GridContainer } from './grid';

type Props = {
  id: 'tokenAAmount' | 'tokenBAmount';
  listTokens: undefined | ObjKeyValue;
  valueSelect: string;
  accountBalances: ObjKeyValue | null;
  selected: string;
  tokenAmountValue: string;
  onChangeSelect: React.Dispatch<React.SetStateAction<string>>;
  amountChangeHandler: (values: string, e: React.ChangeEvent) => void;
};

function TokenSetterSwap({
  amountChangeHandler,
  tokenAmountValue,
  onChangeSelect,
  valueSelect,
  selected,
  id,
  listTokens,
  accountBalances,
}: Props) {
  const reduceOptions = useMemo(() => {
    const tempList: SelectOption[] = [];

    if (listTokens) {
      Object.keys(listTokens).forEach((key) => {
        if (selected !== key) {
          tempList.push({
            value: key,
            text: (
              <DenomArr denomValue={key} onlyText tooltipStatusText={false} />
            ),
            img: <DenomArr denomValue={key} onlyImg tooltipStatusImg={false} />,
          });
        }
      });
    }

    return tempList;
  }, [listTokens, selected]);

  const textAction = useMemo(() => {
    if (id === 'tokenBAmount') {
      return 'receive';
    }
    return 'swap';
  }, [id]);

  return (
    <GridContainer>
      <Col>
        <InputNumber
          id={id}
          value={tokenAmountValue}
          onValueChange={amountChangeHandler}
          title={`choose amount to ${textAction}`}
        />
        <AvailableAmount
          accountBalances={accountBalances}
          token={valueSelect}
        />
      </Col>
      <Select
        valueSelect={valueSelect}
        currentValue={valueSelect}
        onChangeSelect={(item: string) => onChangeSelect(item)}
        width="180px"
        options={reduceOptions}
        title={`choose token to ${textAction}`}
      />
    </GridContainer>
  );
}

export default TokenSetterSwap;
