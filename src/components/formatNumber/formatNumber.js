import React, { Component } from 'react';
import { getDecimal } from '../../utils/utils';
import { formatNumber } from '../../utils/search/utils';

export const FormatNumber = ({ number, fontSizeDecimal, ...props }) => (
  <div {...props}>
    <span>{formatNumber(Math.floor(number))}</span>.
    <span style={{ fontSize: `${fontSizeDecimal || 14}px` }}>
      {getDecimal(number)}
    </span>
  </div>
);
