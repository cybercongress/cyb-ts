import React, { Component } from 'react';
import { getDecimal } from '../../utils/utils';
import { formatNumber } from '../../utils/search/utils';
import { Pane } from '@cybercongress/gravity';

export const FormatNumber = ({ number, fontSizeDecimal, ...props }) => (
  <Pane {...props}>
    <span>{formatNumber(Math.floor(number))}</span>.
    <span style={{ fontSize: `${fontSizeDecimal || 14}px` }}>
      {getDecimal(number)}
    </span>
  </Pane>
);
