import React from 'react';
import { Pane } from '@cybercongress/gravity';
import { CYBER } from '../../utils/config';
import { formatNumber } from '../../utils/utils';
import Denom from '../denom';

const NumberCurrency = ({
  amount,
  fontSizeDecimal,
  currencyNetwork = CYBER.DENOM_CYBER,
  onlyImg,
  onlyText = true,
  ...props
}) => {
  // const number = formatNumber(amount / CYBER.DIVISOR_CYBER_G, 3);
  return (
    <Pane
      display="grid"
      gridTemplateColumns="1fr 45px"
      gridGap="5px"
      {...props}
    >
      <Pane whiteSpace="nowrap" display="flex" alignItems="center">
        <span>{formatNumber(Math.floor(amount))}</span>
      </Pane>
      <div
        style={{ textAlign: 'start', alignItems: 'center', display: 'flex' }}
      >
        <Denom
          denomValue={currencyNetwork}
          onlyText={onlyText}
          onlyImg={onlyImg}
        />
      </div>
    </Pane>
  );
};

export default NumberCurrency;
