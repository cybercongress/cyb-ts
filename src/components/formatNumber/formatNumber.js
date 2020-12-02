import React, { Component } from 'react';
import { getDecimal } from '../../utils/utils';
import { formatNumber } from '../../utils/search/utils';
import { Pane } from '@cybercongress/gravity';

export const FormatNumber = ({
  number,
  fontSizeDecimal,
  currency,
  ...props
}) => (
  <Pane display="grid" gridTemplateColumns="1fr 45px" gridGap="5px" {...props}>
    <Pane display="flex" alignItems="center">
      <span>{formatNumber(Math.floor(number))}</span>.
      <div style={{ width: 30, fontSize: `${fontSizeDecimal || 14}px` }}>
        {getDecimal(number)}
      </div>
    </Pane>
    <div>{currency}</div>
  </Pane>
);
