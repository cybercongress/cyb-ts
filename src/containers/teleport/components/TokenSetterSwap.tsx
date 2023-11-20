import React, { useMemo } from 'react';
import { DenomArr, AvailableAmount } from 'src/components';
import { ObjKeyValue } from 'src/types/data';
import Select, { SelectOption } from 'src/components/Select/index';
import { Nullable } from 'src/types';
import { CYBER } from 'src/utils/config';
import { Col, GridContainer } from './containers/Containers';
import InputNumberDecimalScale from './Inputs/InputNumberDecimalScale/InputNumberDecimalScale';

export const enum TokenSetterId {
  tokenAAmount = 'tokenAAmount',
  tokenBAmount = 'tokenBAmount',
}

type Props = {
  id: TokenSetterId;
  listTokens: Nullable<ObjKeyValue>;
  valueSelect: string;
  amountToken: number;
  selected: string;
  tokenAmountValue: string;
  validInputAmount?: boolean;
  autoFocus?: boolean;
  validAmountMessage?: boolean;
  validAmountMessageText?: string;
  onChangeSelect: React.Dispatch<React.SetStateAction<string>>;
  amountChangeHandler: (values: string, id: TokenSetterId) => void;
};

function TokenSetterSwap({
  amountChangeHandler,
  tokenAmountValue,
  onChangeSelect,
  valueSelect,
  selected,
  id,
  listTokens,
  amountToken,
  validInputAmount,
  autoFocus,
  validAmountMessage,
  validAmountMessageText,
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
    if (id === TokenSetterId.tokenBAmount) {
      return 'receive';
    }
    return 'swap';
  }, [id]);

  return (
    <GridContainer>
      <Col>
        <InputNumberDecimalScale
          id={id}
          value={tokenAmountValue}
          onValueChange={(value, e) => amountChangeHandler(value, e.target.id)}
          title={`choose amount to ${textAction}`}
          validAmount={validInputAmount}
          validAmountMessage={validAmountMessage}
          validAmountMessageText={validAmountMessageText}
          tokenSelect={valueSelect}
          autoFocus={autoFocus}
        />
        <AvailableAmount amountToken={amountToken} />
      </Col>
      <Col>
        <Select
          valueSelect={valueSelect}
          currentValue={valueSelect}
          onChangeSelect={(item: string) => onChangeSelect(item)}
          width="100%"
          options={reduceOptions}
          title={`choose token to ${textAction}`}
        />
        {id === TokenSetterId.tokenAAmount && (
          <Select
            valueSelect="warp"
            currentValue="warp"
            disabled
            width="100%"
            options={[
              {
                value: 'warp',
                text: 'warp',
                img: (
                  <DenomArr
                    denomValue={CYBER.CHAIN_ID}
                    onlyImg
                    type="network"
                    tooltipStatusImg={false}
                  />
                ),
              },
            ]}
            title="choose dex"
          />
        )}
      </Col>
    </GridContainer>
  );
}

export default TokenSetterSwap;
