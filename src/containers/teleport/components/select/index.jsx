/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import {
  DenomArr,
  Select as SelectCommp,
  OptionSelect,
} from '../../../../components';

function Select({
  type,
  valueSelect,
  textSelectValue,
  onChangeSelect,
  children,
  width,
  custom,
  disabled,
}) {
  return (
    <SelectCommp
      valueSelect={valueSelect}
      disabled={disabled}
      width={width}
      onChangeSelect={onChangeSelect}
      currentValue={
        custom ? (
          <OptionSelect text={textSelectValue} value={valueSelect} />
        ) : valueSelect === '' ? (
          <OptionSelect
            text="choose"
            img={
              <DenomArr justifyContent="center" denomValue="choose" onlyImg />
            }
            value=""
          />
        ) : (
          <OptionSelect
            text={
              <DenomArr
                type={type}
                denomValue={textSelectValue}
                onlyText
                tooltipStatusText={false}
              />
            }
            bgrImg={textSelectValue.includes('pool')}
            img={
              <DenomArr
                type={type}
                justifyContent="center"
                denomValue={textSelectValue}
                onlyImg
                tooltipStatusImg={false}
              />
            }
            value={valueSelect}
          />
        )
      }
    >
      {Object.keys(children).length > 0 ? children : ''}
    </SelectCommp>
  );
}

export default Select;
