import React, { Component } from 'react';
import { Pane } from '@cybercongress/gravity';
import { getDecimal } from '../../utils/utils';
import { formatNumber } from '../../utils/search/utils';

export function FormatNumber({ number, fontSizeDecimal, currency, ...props }) {
  return (
    <Pane {...props}>
      <span>{formatNumber(Math.floor(number))}</span>.
      <span style={{ fontSize: `${fontSizeDecimal || 14}px` }}>
        {getDecimal(number)}
      </span>{' '}
      {currency}
    </Pane>
  );
}
